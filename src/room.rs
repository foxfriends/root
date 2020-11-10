use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::{mpsc::UnboundedSender, RwLock};
use uuid::Uuid;

lazy_static! {
    static ref ROOMS: RwLock<HashMap<String, Room>> = Default::default();
}

/// A group of sockets which are communicating together, typically because they
/// are part of the same lobby or game.
///
/// Rooms are identified by a room name.
#[derive(Clone)]
pub struct Room(Arc<RwLock<HashMap<Uuid, UnboundedSender<String>>>>);

impl Room {
    fn new() -> Self {
        Room(Default::default())
    }

    /// Get a reference to the Room by the given name.
    pub async fn get(name: String) -> Self {
        ROOMS.write()
            .await
            .entry(name)
            .or_insert(Room::new())
            .clone()
    }
}
