#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize)]
pub enum Phase {
    Lobby,
    Setup,
    Game,
}
