#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename = "phase")]
#[serde(rename_all = "snake_case")]
pub enum Phase {
    Lobby,
    ChooseFaction,
    Setup,
    Birdsong,
    Daylight,
    Evening,
    Completed,
}
