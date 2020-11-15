use super::room::Room;
use crate::models::{Game, GameConfig};
use tokio::sync::mpsc::UnboundedSender;
use uuid::Uuid;

/// The state of a single client's socket.
pub struct SocketState {
    /// A unique ID for this socket.
    id: Uuid,
    /// The name of the player who is the client of this socket.
    name: Option<String>,
    /// A room that this socket is part of.
    room: Option<Room>,
    /// A channel by which to actually send messages to the socket.
    tx: UnboundedSender<String>,
}

impl SocketState {
    /// Create a new socket's state.
    pub fn new(tx: UnboundedSender<String>) -> Self {
        Self {
            id: Uuid::new_v4(),
            name: None,
            room: None,
            tx,
        }
    }

    /// The room this socket is in, if any.
    pub fn room(&self) -> Option<Room> {
        self.room.clone()
    }

    /// The name of this socket, if set.
    pub fn name(&self) -> Option<&str> {
        self.name.as_deref()
    }

    /// The ID of this socket.
    pub fn id(&self) -> Uuid {
        self.id
    }

    /// Stores the player's name with the socket.
    ///
    /// # Errors
    ///
    /// The name cannot be changed if the socket is already in a room.
    pub fn set_name(&mut self, name: &str) -> Result<(), String> {
        if self.room.is_some() {
            return Err("You cannot change your name while in a room.".into());
        }
        self.name = Some(name.to_owned());
        Ok(())
    }

    /// Leaves the room the socket is currently in.
    pub async fn leave_room(&mut self) {
        if let Some(room) = self.room.take() {
            room.leave(&self).await.unwrap();
        }
    }

    /// Joins a room, by name, if it exists.
    pub async fn join_room(&mut self, name: &str) -> Result<Game, String> {
        if self.room.is_some() {
            return Err("You are already in a room. Leave that one first.".into());
        }
        let room = Room::get(name)
            .await
            .ok_or_else(|| format!("No room {} exists. Maybe you should make one?", name))?;
        self.join_room_inner(room).await
    }

    /// Creates and then joins a room.
    pub async fn join_new_room(&mut self, config: &GameConfig) -> Result<Game, String> {
        if self.room.is_some() {
            return Err("You are already in a room. Leave that one first.".into());
        }
        let room = Room::new(config).await?;
        self.join_room_inner(room).await
    }

    async fn join_room_inner(&mut self, room: Room) -> Result<Game, String> {
        room.join(&self).await?;
        let game = room.game().await;
        self.room = Some(room);
        Ok(game)
    }

    pub fn sender(&self) -> UnboundedSender<String> {
        self.tx.clone()
    }
}
