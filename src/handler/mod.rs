use colored::*;
use futures::{future::ready, StreamExt};
use log::{debug, info, warn};
use std::sync::Arc;
use tokio::sync::mpsc::unbounded_channel;
use tokio::sync::RwLock;
use warp::ws::{self, WebSocket};

mod command_error;
mod message;
mod packet;
mod response;
mod room;
mod runtime;
mod socket_state;
mod status;

use command_error::CommandError;
use message::Message;
use packet::Packet;
use response::Response;
use socket_state::SocketState;
use status::Status;

pub async fn handler(websocket: WebSocket) {
    let (ws_tx, ws_rx) = websocket.split();
    let (tx, rx) = unbounded_channel::<String>();
    tokio::task::spawn(rx.map(ws::Message::text).map(Ok).forward(ws_tx));
    let state = SocketState::new(tx);
    info!("Socket connected {}", state.id());
    let state = Arc::new(RwLock::new(state));
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
                    let sender = st.sender();
                    let packet = match serde_json::from_str::<Packet>(msg.as_str()) {
                        Ok(packet) => packet,
                        Err(error) => {
                            warn!("Invalid packet received `{}`\n{}", msg, error);
                            return;
                        }
                    };
                    match st.name() {
                        Some(name) => debug!(
                            "{} ({}): {:?}",
                            st.id().to_string().yellow(),
                            name.bright_yellow(),
                            packet.message(),
                        ),
                        None => debug!("{}: {:?}", st.id().to_string().yellow(), packet.message()),
                    };
                    std::mem::drop(st);
                    match Message::handle(state, packet.message()).await {
                        Ok(value) => sender.send(packet.respond_ok(value).to_string()).ok(),
                        Err(error) => sender.send(packet.respond_err(error).to_string()).ok(),
                    };
                }
            }
        })
        .await;
    let mut state = state.write().await;
    state.leave_room().await;
    info!("Socket disconnected {}", state.id());
}
