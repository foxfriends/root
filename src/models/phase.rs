#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize, sqlx::Type)]
#[serde(rename = "phase", rename_all = "snake_case")]
#[sqlx(type_name = "enum_phase", rename_all = "snake_case")]
pub enum Phase {
    Lobby,
    ChooseFaction,
    Setup,
    Birdsong,
    Daylight,
    Evening,
    Completed,
}

impl Default for Phase {
    fn default() -> Self {
        Self::Lobby
    }
}
