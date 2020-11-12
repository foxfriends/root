use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::{mpsc::UnboundedSender, RwLock};
use uuid::Uuid;
use crate::game::Game;

lazy_static! {
    static ref ROOMS: RwLock<HashMap<String, Room>> = Default::default();
}

/// A room contains a group of players and a game, much like a real board game room would.
/// Rooms are identified/joined by name.
///
/// Cloning the room will create another reference to the same room.
#[derive(Clone)]
pub struct Room(Arc<RoomContent>);

struct RoomContent {
    sockets: RwLock<HashMap<Uuid, UnboundedSender<String>>>,
    name: String,
    game: Game,
}

impl std::ops::Deref for Room {
    type Target = Game;

    fn deref(&self) -> &Self::Target {
        &self.0.game
    }
}

impl Room {
    /// Creates a new room with a game set up as described.
    ///
    /// # Errors
    ///
    /// Creating a new room will fail if the name is already in use.
    pub async fn new(name: String, config: ()) -> Result<Self, &'static str> {
        let mut rooms = ROOMS.write().await;
        if rooms.contains_key(&name) {
            return Err("A room by this name already exists.")
        }
        let room = Room(Arc::new(RoomContent {
            sockets: Default::default(),
            name: name.clone(),
            game: Game::create(config),
        }));
        rooms.insert(name, room.clone());
        Ok(room)
    }

    /// Get a reference to the Room by the given name.
    pub async fn get(name: &String) -> Option<Self> {
        ROOMS.read().await.get(name).cloned()
    }

    /// Broadcasts a message to the other sockets in this room. Any messages that fail to send
    /// are silently lost. Typically that will be because the client has already hung up.
    pub async fn send(&self, message: String) {
        let sockets = self.0.sockets.read().await;
        for socket in sockets.values() {
            socket.send(message.clone()).ok();
        }
    }

    /// Gets a specific socket, by ID, from this room.
    ///
    /// # Panics
    ///
    /// If the given ID is not actually in this room, this function will panic.
    pub async fn socket(&self, id: Uuid) -> UnboundedSender<String> {
        self.0.sockets.read().await.get(&id).unwrap().clone()
    }
}
