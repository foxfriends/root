use crate::room::Room;
use tokio::sync::mpsc::UnboundedSender;
use uuid::Uuid;

pub struct SocketState {
    id: Uuid,
    name: String,
    room: Option<Room>,
    tx: UnboundedSender<String>,
}

impl SocketState {
    pub fn new(tx: UnboundedSender<String>) -> Self {
        Self {
            id: Uuid::new_v4(),
            name: String::default(),
            room: None,
            tx,
        }
    }
}
