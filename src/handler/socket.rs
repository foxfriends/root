use super::{runtime::LUMBER, Message, Room};
use crate::models::GameConfig;
use futures::StreamExt;
use log::warn;
use lumber::{Question, Value};
use serde_json::json;
use std::convert::TryFrom;
use std::sync::Arc;
use tokio::sync::{
    mpsc::{unbounded_channel, UnboundedReceiver, UnboundedSender},
    RwLock,
};
use uuid::Uuid;

/// The state of a single client's socket.
#[derive(Clone)]
pub struct Socket {
    id: Uuid,
    state: Arc<RwLock<SocketState>>,
    handle: SocketHandle,
}

/// The state part of the socket.
struct SocketState {
    /// The name of the player who is the client of this socket.
    name: Option<String>,
    /// A room that this socket is part of.
    room: Option<Room>,
}

/// The communication part of the socket.
#[derive(Clone)]
pub struct SocketHandle {
    /// A channel by which to actually send messages to the client.
    to_client: UnboundedSender<serde_json::Value>,
    /// A channel by which to send messages to this `SocketState` (actor style).
    to_handler: UnboundedSender<Message>,
}

impl Socket {
    /// Create a new socket's state.
    pub fn new() -> (Self, UnboundedReceiver<serde_json::Value>) {
        let (to_client, outputs) = unbounded_channel::<serde_json::Value>();
        let (to_handler, messages) = unbounded_channel::<Message>();
        let socket = Self {
            id: Uuid::new_v4(),
            state: Arc::new(RwLock::new(SocketState {
                name: None,
                room: None,
            })),
            handle: SocketHandle {
                to_client,
                to_handler,
            },
        };
        tokio::task::spawn(messages.for_each({
            let socket = socket.clone();
            move |message| {
                let socket = socket.clone();
                async move {
                    let state = socket.state.read().await;
                    match message {
                        Message::Update => {
                            state
                                .room
                                .as_ref()
                                .unwrap()
                                .with_game(|game| {
                                    LUMBER.with(|lumber| {
                                        let question =
                                            Question::try_from("actions(Name, State, Action)")
                                                .unwrap()
                                                .with(
                                                    "Name",
                                                    Value::string(state.name.as_ref().unwrap()),
                                                )
                                                .with("State", Value::serialize(game).unwrap());
                                        let actions = lumber
                                            .ask(&question)
                                            .map(|binding| question.answer(&binding).unwrap())
                                            .map(|mut answer| {
                                                answer
                                                    .remove("Action")
                                                    .unwrap()
                                                    .unwrap()
                                                    .to_string()
                                            })
                                            .collect::<Vec<_>>();
                                        socket
                                            .emit(json!({ "game": game, "actions": actions }))
                                            .ok();
                                    })
                                })
                                .await
                        }
                    }
                }
            }
        }));
        (socket, outputs)
    }

    /// Get the ID of this socket.
    pub fn id(&self) -> Uuid {
        self.id
    }

    /// Get the name of this socket (really, the user of this socket), if set.
    pub async fn name(&self) -> Option<String> {
        self.state.read().await.name.clone()
    }

    /// Get the handle of this socket.
    pub fn handle(&self) -> SocketHandle {
        self.handle.clone()
    }

    /// Stores the player's name with the socket.
    ///
    /// # Errors
    ///
    /// The name cannot be changed if the socket is already in a room.
    pub async fn set_name(&self, name: String) -> Result<(), String> {
        let mut state = self.state.write().await;
        if state.room.is_some() {
            return Err("You cannot change your name while in a room.".into());
        }
        state.name = Some(name.to_owned());
        Ok(())
    }

    /// Leaves the room the socket is currently in. If the socket is not in a room, this will
    /// do nothing.
    pub async fn leave_room(&self) {
        let mut state = self.state.write().await;
        if let Some(room) = state.room.take() {
            room.leave(state.name.as_deref().unwrap()).await;
            // We have to tell the room to update explicitly, as we are no longer part of it so
            // it will not be done automatically after the request.
            room.send(state.name.as_deref().unwrap(), Message::Update)
                .await;
        }
    }

    /// Joins a room, by name, if it exists.
    pub async fn join_room(&self, name: String) -> Result<(), String> {
        let room = Room::get(&name)
            .await
            .ok_or_else(|| format!("No room {} exists. Maybe you should make one?", name))?;
        self.join_room_inner(room).await
    }

    /// Creates and then joins a room.
    pub async fn join_new_room(&self, config: GameConfig) -> Result<(), String> {
        let room = Room::new(config).await?;
        self.join_room_inner(room).await
    }

    async fn join_room_inner(&self, room: Room) -> Result<(), String> {
        let mut state = self.state.write().await;
        if state.name.is_none() {
            return Err("You must set a name before entering a room.".into());
        }
        if state.room.is_some() {
            return Err("You are already in a room. Leave that one first.".into());
        }
        room.join(state.name.as_deref().unwrap(), self.handle())
            .await?;
        state.room = Some(room);
        self.send(Message::Update).ok();
        Ok(())
    }

    /// Perform a Lumber action sent by the client.
    pub async fn perform(&self, command: String) -> Result<(), String> {
        let mut state = self.state.write().await;
        let name = state.name.clone().unwrap();
        match &mut state.room {
            None => Err("You must be part of a room to perform commands.".into()),
            Some(room) => {
                room.with_game_mut(|game| {
                    LUMBER.with(|lumber| {
                        let command =
                            format!("command(Name, State, {}, NewState, Actions)", command);
                        let question = Question::try_from(command.as_str()).map(|question| {
                            question
                                .with("Name", Value::string(name))
                                .with("State", Value::serialize(&game).unwrap())
                        });
                        match question {
                            Ok(question) => {
                                let mut answers = lumber.ask(&question);
                                match answers.next() {
                                    Some(binding) => {
                                        let mut answer = question.answer(&binding).unwrap();
                                        let new_state = answer.remove("NewState").unwrap().unwrap();
                                        *game = Value::deserialize(&new_state).unwrap();
                                        let actions: Vec<String> = answer
                                            .remove("Actions")
                                            .unwrap()
                                            .unwrap()
                                            .as_list()
                                            .unwrap()
                                            .iter()
                                            .filter_map(|action| action.map(ToString::to_string))
                                            .collect();
                                        self.emit(json!({ "game": game, "actions": actions })).ok();
                                    }
                                    None => {
                                        warn!("Command could not be performed: `{}`", command);
                                    }
                                }
                                if answers.next().is_some() {
                                    warn!("Command was performed in multiple ways: `{}`", command);
                                }
                            }
                            Err(error) => {
                                warn!("Invalid command `{}`\n{}", command, error);
                            }
                        }
                    });
                    Ok(())
                })
                .await
            }
        }
    }
}

impl Socket {
    /// Sends a message to all other sockets in the same room as this one
    pub async fn broadcast(&self, message: Message) {
        let state = self.state.read().await;
        if let Some(room) = &state.room {
            room.send(state.name.as_deref().unwrap(), message).await;
        }
    }

    /// Send a message to this socket.
    pub fn send(
        &self,
        message: Message,
    ) -> Result<(), tokio::sync::mpsc::error::SendError<Message>> {
        self.handle.to_handler.send(message)
    }

    /// Send a message out the socket, to the client.
    pub fn emit(
        &self,
        message: serde_json::Value,
    ) -> Result<(), tokio::sync::mpsc::error::SendError<serde_json::Value>> {
        self.handle.to_client.send(message)
    }
}

impl SocketHandle {
    /// Send a message to this socket.
    pub fn send(
        &self,
        message: Message,
    ) -> Result<(), tokio::sync::mpsc::error::SendError<Message>> {
        self.to_handler.send(message)
    }

    /// Send a message out the socket, to the client.
    #[allow(dead_code)]
    pub fn emit(
        &self,
        message: serde_json::Value,
    ) -> Result<(), tokio::sync::mpsc::error::SendError<serde_json::Value>> {
        self.to_client.send(message)
    }
}
