use super::SocketHandle;
use crate::models::{Game, GameConfig, Phase};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;

lazy_static! {
    /// TODO: I think there are some races that can happen about adding/removing from this
    /// global `ROOMS` list. Not all that important for now, but should be addressed
    /// eventually...
    static ref ROOMS: RwLock<HashMap<String, Room>> = Default::default();
}

/// A room contains a group of players and a game, much like a real board game room would.
/// Rooms are identified/joined by name.
///
/// Cloning the room will create another reference to the same room.
#[derive(Clone)]
pub struct Room(Arc<RoomContent>);

struct RoomContent {
    sockets: RwLock<HashMap<String, SocketHandle>>,
    game: RwLock<Game>,
}

impl Room {
    /// Creates a new room with a game set up as described.
    ///
    /// # Errors
    ///
    /// Creating a new room will fail if the name is already in use.
    pub async fn new(config: GameConfig) -> Result<Self, String> {
        let mut rooms = ROOMS.write().await;
        if rooms.contains_key(&config.name) {
            return Err(format!("A room named {} already exists.", config.name));
        }
        let name = config.name.clone();
        let room = Room(Arc::new(RoomContent {
            sockets: Default::default(),
            game: RwLock::new(Game::create(config)),
        }));
        rooms.insert(name, room.clone());
        Ok(room)
    }

    /// Get a reference to the Room by the given name.
    pub async fn get(name: &str) -> Option<Self> {
        ROOMS.read().await.get(name).cloned()
    }

    /// Attempt to add a socket to this room. A socket may only join if:
    /// 1.  The socket has a name;
    /// 2.  There is an available space for this socket, meaning:
    ///     *   the game has not started, there is an unclaimed space, and no
    ///         player with the socket's name is already in the game; or
    ///     *   the game has started, but one of the spaces is claimed for a
    ///         player with the socket's name, and that player is not already
    ///         connected.
    pub async fn join(&self, name: &str, handle: SocketHandle) -> Result<(), String> {
        let mut game = self.0.game.write().await;
        let mut sockets = self.0.sockets.write().await;
        match game.phase() {
            Phase::Lobby => {
                game.add_player(name)?;
                sockets.insert(name.to_owned(), handle);
                Ok(())
            }
            _ => {
                let is_valid_player = game
                    .players()
                    .iter()
                    .find(|player| player.name() == name)
                    .is_none();
                if is_valid_player {
                    return Err(format!("{} is not a player in this game.", name));
                }
                if sockets.contains_key(name) {
                    return Err(format!("{} is already in this room.", name));
                }
                sockets.insert(name.to_owned(), handle);
                Ok(())
            }
        }
    }

    /// Removes a socket from this room. If the game in the room has not yet started,
    /// this also removes the socket's player from the game.
    pub async fn leave(&self, name: &str) {
        let mut game = self.0.game.write().await;
        let mut sockets = self.0.sockets.write().await;
        if game.phase() == Phase::Lobby {
            game.remove_player(name).unwrap();
            if game.players().is_empty() {
                ROOMS.write().await.remove(game.name());
            }
        }
        sockets.remove(name);
    }

    /// Allows access to the contained game object.
    pub async fn with_game_mut<F, T>(&self, cb: F) -> T
    where
        F: FnOnce(&mut Game) -> T,
    {
        let mut game = self.0.game.write().await;
        cb(&mut *game)
    }

    /// Creates a clone of the game being played in this room. Typically this is so it can be
    /// sent to the client, it is not meant to be worked with in this form, as it can easily
    /// become outdated.
    pub async fn game(&self) -> Game {
        self.0.game.read().await.clone()
    }
}
