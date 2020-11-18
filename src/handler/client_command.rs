use super::{CommandError, Socket};
use crate::models::GameConfig;

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum ClientCommand {
    SetName(String),
    JoinGame(String),
    CreateGame(GameConfig),
    LeaveGame,
    Perform(String),
}

impl ClientCommand {
    /// Handles each message from a socket. The actual engine is written in Lumber, and messages
    /// are actions in the form of text-serialized Lumber structures, typically as output by the
    /// Lumber program.
    pub async fn execute(self, socket: &Socket) -> Result<(), CommandError> {
        match self {
            Self::SetName(name) => socket.set_name(name).await.map_err(CommandError::set_name),
            Self::JoinGame(name) => socket
                .join_room(name)
                .await
                .map_err(CommandError::join_game),
            Self::CreateGame(config) => socket
                .join_new_room(config)
                .await
                .map_err(CommandError::create_game),
            Self::LeaveGame => {
                socket.leave_room().await;
                Ok(())
            }
            ClientCommand::Perform(cmd) => socket
                .perform(cmd)
                .await
                .map_err(|_| CommandError::unexpected()), // TODO: this is not unexpected!
        }
    }
}
