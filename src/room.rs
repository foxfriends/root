use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::{mpsc::UnboundedSender, RwLock};
use uuid::Uuid;

lazy_static! {
    static ref ROOMS: RwLock<HashMap<String, Room>> = Default::default();
}

#[derive(Clone)]
pub struct Room(Arc<RwLock<HashMap<Uuid, UnboundedSender<String>>>>);

impl Room {
    fn new() -> Self {
        Room(Default::default())
    }

    pub async fn get(name: String) -> Self {
        ROOMS.write()
            .await
            .entry(name)
            .or_insert(Room::new())
            .clone()
    }
}
