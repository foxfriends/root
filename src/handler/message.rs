use super::runtime::LUMBER;
use super::{CommandError, SocketState};
use crate::models::GameConfig;
use log::warn;
use lumber::{Question, Value};
use std::convert::TryFrom;
use std::sync::Arc;
use tokio::sync::RwLock;

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum Message {
    SetName(String),
    JoinGame(String),
    CreateGame(GameConfig),
    Perform(String),
}

impl Message {
    /// Handles each message from a socket. The actual engine is written in Lumber, and messages
    /// are actions in the form of text-serialized Lumber structures, typically as output by the
    /// Lumber program.
    pub async fn handle(
        state: Arc<RwLock<SocketState>>,
        msg: &Message,
    ) -> Result<serde_json::Value, CommandError> {
        let room = state.read().await.room();
        let result = match msg {
            Message::SetName(name) if room.is_none() => state
                .write()
                .await
                .set_name(name)
                .map(|()| serde_json::Value::Null)
                .map_err(CommandError::set_name),
            Message::JoinGame(name) if room.is_none() => state
                .write()
                .await
                .join_room(name)
                .await
                .map(|out| serde_json::to_value(out).unwrap())
                .map_err(CommandError::join_game),
            Message::CreateGame(config) if room.is_none() => state
                .write()
                .await
                .join_new_room(config)
                .await
                .map(|out| serde_json::to_value(out).unwrap())
                .map_err(CommandError::create_game),
            Message::Perform(cmd) if room.is_some() => room
                .unwrap()
                .with_game_mut(|game| {
                    LUMBER.with(|lumber| {
                        let command = format!("command(Socket, State, {}, NewState, Actions)", cmd);
                        let question = Question::try_from(command.as_str()).map(|question| {
                            question
                                .with("Socket", Value::any(state))
                                .with("NewState", Value::serialize(game).unwrap())
                        });
                        match question {
                            Ok(question) => {
                                for binding in lumber.ask(&question) {
                                    let mut answer = question.answer(&binding).unwrap();
                                    let new_state = answer.remove("NewState").unwrap().unwrap();
                                    *game = Value::deserialize(&new_state).unwrap();
                                    let _actions: Vec<String> = answer
                                        .remove("Actions")
                                        .unwrap()
                                        .unwrap()
                                        .as_list()
                                        .unwrap()
                                        .iter()
                                        .filter_map(|action| action.map(ToString::to_string))
                                        .collect();
                                    todo!("what to do with the actions?")
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
                .map(|()| serde_json::Value::Null),
            _ => {
                warn!("Unexpected message `{:?}`", msg);
                return Err(CommandError::unexpected());
            }
        };
        if let Err(error) = &result {
            warn!("Error while processing command:\n{}", error.message());
        }
        result
    }
}
