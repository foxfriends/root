#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename = "phase")]
#[serde(rename_all = "kebab-case")]
pub enum Phase {
    Lobby,
    Setup,
    Game,
}
