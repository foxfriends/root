use futures::{future::ready, StreamExt};
use log::debug;
use std::sync::Arc;
use tokio::sync::mpsc::unbounded_channel;
use tokio::sync::RwLock;
use warp::ws::{Message, WebSocket};

mod handler;
mod room;
mod socket_state;

use handler::handle;
use socket_state::SocketState;

pub async fn handler(websocket: WebSocket) {
    let (ws_tx, ws_rx) = websocket.split();
    let (tx, rx) = unbounded_channel::<String>();
    tokio::task::spawn(rx.map(Message::text).map(Ok).forward(ws_tx));
    let state = Arc::new(RwLock::new(SocketState::new(tx)));
    ws_rx
        .take_while(|result| ready(result.is_ok()))
        .map(Result::unwrap)
        .map(|msg| msg.to_str().map(|s| s.to_owned()))
        .take_while(|result| ready(result.is_ok()))
        .map(Result::unwrap)
        .for_each({
            let state = state.clone();
            move |msg| {
                let state = state.clone();
                async move {
                    let st = state.read().await;
                    match st.name() {
                        Some(name) => debug!("{}({}): {}", st.id(), name, msg),
                        None => debug!("{}: {}", st.id(), msg),
                    };
                    std::mem::drop(st);
                    handle(state, msg).await
                }
            }
        })
        .await;
    state.write().await.leave_room().await;
}
