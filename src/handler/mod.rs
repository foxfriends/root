use futures::{future::ready, StreamExt};
use tokio::sync::mpsc::unbounded_channel;
use tokio::sync::RwLock;
use std::sync::Arc;
use warp::ws::{Message, WebSocket};

mod handler;
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
        .for_each(move |msg| handle(state.clone(), msg))
        .await;
}
