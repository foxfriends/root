use super::{CommandError, SocketState};
use log::warn;
use lumber::{Question, Value};
use std::convert::TryFrom;
use std::sync::Arc;
use tokio::sync::RwLock;

mod message;
pub use message::Message;
mod runtime;
use runtime::LUMBER;

/// Handles each message from a socket. The actual engine is written in Lumber, and messages
/// are actions in the form of text-serialized Lumber structures, typically as output by the
/// Lumber program.
pub async fn handle(state: Arc<RwLock<SocketState>>, msg: Message) -> Result<(), CommandError> {
    let room = state.read().await.room();
    let result = match msg {
        Message::SetName(name) if room.is_none() => state
            .write()
            .await
            .set_name(name)
            .map_err(CommandError::set_name),
        Message::JoinGame(name) if room.is_none() => state
            .write()
            .await
            .join_room(name)
            .await
            .map_err(CommandError::join_game),
        Message::CreateGame(config) if room.is_none() => state
            .write()
            .await
            .join_new_room(config)
            .await
            .map_err(CommandError::create_game),
        Message::Perform(cmd) if room.is_some() => {
            room.unwrap()
                .with_game(|game| {
                    LUMBER.with(|lumber| {
                        let command = format!("command(Socket, Game, {}, NewGame, Responses)", cmd);
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
                    Ok(())
                })
                .await
        }
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
