use crate::models::GameConfig;

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum Message {
    SetName(String),
    JoinGame(String),
    CreateGame(GameConfig),
    Perform(String),
}
