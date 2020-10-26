use futures::{FutureExt, StreamExt};
use warp::ws::WebSocket;

pub async fn game(websocket: WebSocket) {
    let (tx, rx) = websocket.split();
    // TODO: build this thing.
}
