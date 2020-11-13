use super::SocketState;
use crate::models::GameConfig;
use log::warn;
use lumber::{Question, Value};
use serde::Deserialize;
use std::convert::TryFrom;
use std::sync::Arc;
use tokio::sync::RwLock;

mod runtime;
use runtime::LUMBER;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
enum Message {
    SetName(String),
    JoinGame(String),
    CreateGame(GameConfig),
}

/// Handles each message from a socket. The actual engine is written in Lumber, and messages
/// are actions in the form of text-serialized Lumber structures, typically as output by the
/// Lumber program.
pub async fn handle(state: Arc<RwLock<SocketState>>, msg: String) {
    let room = state.read().await.room();
    match room {
        None => {
            let result = match serde_json::from_str::<Message>(&msg) {
                Ok(Message::SetName(name)) => state.write().await.set_name(name),
                Ok(Message::JoinGame(name)) => state.write().await.join_room(name).await,
                Ok(Message::CreateGame(config)) => state.write().await.join_new_room(config).await,
                Err(error) => {
                    warn!("Malformed message `{}`\n{}", msg, error);
                    return;
                }
            };
            if let Err(error) = result {
                warn!("Error while processing message `{}`\n{}", msg, error);
            }
            // TODO: some kind of acknowledgement should be sent to the client
        }
        Some(room) => {
            room.with_game(|game| {
                LUMBER.with(|lumber| {
                    let command = format!("command(Socket, Game, {}, NewGame, Responses)", msg);
                    let question = Question::try_from(command.as_str()).map(|question| {
                        question
                            .with("Socket", Value::any(state))
                            .with("Game", Value::serialize(game).unwrap())
                    });
                    match question {
                        Ok(question) => {
                            for binding in lumber.ask(&question) {
                                let answer = question.answer(&binding).unwrap();
                            }
                        }
                        Err(error) => {
                            warn!("Invalid command `{}`\n{}", command, error);
                        }
                    }
                });
            })
            .await;
        }
    }
}
