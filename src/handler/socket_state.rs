use crate::room::Room;
use tokio::sync::mpsc::UnboundedSender;
use uuid::Uuid;

/// The state of a single client's socket.
pub struct SocketState {
    /// A unique ID for this socket.
    id: Uuid,
    /// The name of the player who is the client of this socket.
    name: String,
    /// A room that this socket is part of.
    room: Option<Room>,
    /// A channel by which to actually send messages to the socket.
    tx: UnboundedSender<String>,
}

impl SocketState {
    /// Create a new socket's state.
    pub fn new(tx: UnboundedSender<String>) -> Self {
        Self {
            id: Uuid::new_v4(),
            name: String::default(),
            room: None,
            tx,
        }
    }

    /// The room this socket is in, if any.
    pub fn room(&self) -> Option<Room> {
        self.room.clone()
    }
}
