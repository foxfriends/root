use super::{Message, SocketHandle};
use crate::models::{Game, GameConfig, Phase};
use log::{error, info};
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
    fn new_inner(game: Game) -> Self {
        Self(Arc::new(RoomContent {
            sockets: Default::default(),
            game: RwLock::new(game),
        }))
    }

    /// Creates a new room with a game set up as described.
    ///
    /// # Errors
    ///
    /// Creating a new room will fail if the name is already in use.
    pub async fn new(config: GameConfig) -> Result<Self, String> {
        let mut rooms = ROOMS.write().await;
        if rooms.contains_key(&config.name)
            || Game::exists(&config.name)
                .await
                .map_err(|err| err.to_string())?
        {
            return Err(format!("A room named {} already exists.", config.name));
        }
        let name = config.name.clone();
        let room = Room::new_inner(Game::create(config).await.map_err(|err| err.to_string())?);
        rooms.insert(name, room.clone());
        Ok(room)
    }

    /// Get a reference to the Room by the given name.
    pub async fn get(name: &str) -> Result<Self, String> {
        let mut rooms = ROOMS.write().await;
        if let Some(room) = rooms.get(name) {
            Ok(room.clone())
        } else {
            let game = Game::load(name).await.map_err(|err| err.to_string())?;
            let room = Room::new_inner(game);
            info!("loaded game {}", name);
            rooms.insert(name.to_owned(), room.clone());
            Ok(room)
        }
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
        sockets.remove(name);
        if game.phase() == Phase::Lobby {
            game.remove_player(name).unwrap();
            if game.players().is_empty() {
                info!("deleting unstarted game {}", game.name());
                game.delete().await.ok();
                ROOMS.write().await.remove(game.name());
            }
        } else if sockets.is_empty() {
            info!("saving game {}", game.name());
            if let Err(error) = game.save().await {
                error!("failed to save game {}: {}", game.name(), error);
            }
            ROOMS.write().await.remove(game.name());
        }
    }

    /// Allows access to the contained game object.
    pub async fn with_game_mut<F, T>(&self, cb: F) -> T
    where
        F: FnOnce(&mut Game) -> T,
    {
        let mut game = self.0.game.write().await;
        cb(&mut *game)
    }

    /// Allows access to the contained game object.
    pub async fn with_game<F, T>(&self, cb: F) -> T
    where
        F: FnOnce(&Game) -> T,
    {
        let game = self.0.game.read().await;
        cb(&*game)
    }

    /// Sends a message to all sockets in this room, except the one that is sending the message.
    pub async fn send(&self, sender: &str, message: Message) {
        let sockets = self.0.sockets.read().await;
        for (name, socket) in sockets.iter() {
            if name != sender {
                socket.send(message).ok();
            }
        }
    }
}
