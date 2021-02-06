use colored::*;
use futures::StreamExt;
use log::{debug, info};
use tokio_stream::wrappers::UnboundedReceiverStream;
use warp::ws::{self, WebSocket};
use std::time::Instant;

mod client_command;
mod command_error;
mod message;
mod packet;
mod room;
mod runtime;
mod socket;
mod status;

use client_command::ClientCommand;
use command_error::CommandError;
use message::Message;
use packet::Packet;
use room::Room;
use socket::{Socket, SocketHandle};
use status::Status;

pub async fn handler(websocket: WebSocket) {
    let (ws_tx, ws_rx) = websocket.split();
    let (socket, outputs) = Socket::new();
    tokio::task::spawn(
        UnboundedReceiverStream::new(outputs)
            .map(|value| value.to_string())
            .map(ws::Message::text)
            .map(Ok)
            .forward(ws_tx),
    );
    let id = socket.id().to_string()[..8].yellow();
    info!("{}: connected", id);
    ws_rx
        .filter_map(|msg| async { msg.ok() })
        .filter_map(|msg| async move { serde_json::from_str::<Packet>(msg.to_str().ok()?).ok() })
        .for_each({
            let socket = socket.clone();
            let id = &id;
            move |packet| {
                let socket = socket.clone();
                async move {
                    let start = Instant::now();
                    let name = socket.name().await;
                    match name {
                        Some(name) => {
                            debug!("{} ({}): {:?}", id, name.bright_yellow(), packet.command())
                        }
                        None => debug!("{}: {:?}", id, packet.command()),
                    }
                    let response = packet.execute(&socket).await;
                    let duration = Instant::now() - start;
                    debug!("{} {:?}", id, duration);
                    socket.broadcast(Message::Update).await;
                    socket.emit(response).ok();
                }
            }
        })
        .await;
    socket.leave_room().await;
    info!("{}: connected", id);
}
