#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename = "phase")]
#[serde(rename_all = "camelCase")]
pub enum Phase {
    Lobby,
    ChooseFaction,
    Setup,
    Game,
}
