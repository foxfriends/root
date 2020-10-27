use futures::{FutureExt, StreamExt};
use lumber::{Question, Lumber};
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
        let question = Question::try_from(msg.as_str()).unwrap();
        for binding in lumber.ask(&question) {
            let answer = question.answer(&binding).unwrap();
        }
    });
}
