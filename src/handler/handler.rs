use futures::{FutureExt, StreamExt};
use log::error;
use lumber::{Question, Lumber, Value};
use super::SocketState;
use tokio::sync::RwLock;
use std::sync::Arc;
use std::convert::TryFrom;

thread_local! {
    static LUMBER: Lumber<'static> = Lumber::builder()
        .build_from_file("game/main.lumber")
        .unwrap();
}

/// Handles each message from a socket. The actual engine is written in Lumber, and messages
/// are actions in the form of text-serialized Lumber structures, typically as output by the
/// Lumber program.
pub async fn handle(state: Arc<RwLock<SocketState>>, msg: String) {
    let room = state.read().await.room();
    match room {
        None => {
            todo!("Handle the name/room setup");
        }
        Some(game) => {
            LUMBER.with(|lumber| {
                let command = format!("command(Socket, Game, {}, NewGame, Responses)", msg);
                let question = Question::try_from(command.as_str())
                    .map(|question| question
                        .with("Socket", Value::any(state))
                        .with("Game", Value::serialize(&*game).unwrap()));
                match question {
                    Ok(question) => {
                        for binding in lumber.ask(&question) {
                            let answer = question.answer(&binding).unwrap();
                        }
                    }
                    Err(error) => {
                        error!("Invalid command `{}`\n{}", command, error);
                    }
                }
            });
        }
    }
}
