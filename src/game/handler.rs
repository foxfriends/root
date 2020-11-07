use futures::{FutureExt, StreamExt};
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

pub async fn handle(state: Arc<RwLock<SocketState>>, msg: String) {
    LUMBER.with(|lumber| {
        let command = format!("command(Socket, Game, {}, NewGame, Responses)", msg);
        let question = Question::try_from(command.as_str()).unwrap()
            .with("Socket", Value::any(state));
        for binding in lumber.ask(&question) {
            let answer = question.answer(&binding).unwrap();
        }
    });
}
