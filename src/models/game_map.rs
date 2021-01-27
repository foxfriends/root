#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize, sqlx::Type)]
#[serde(rename = "map", rename_all = "snake_case")]
#[sqlx(type_name = "enum_game_map", rename_all = "snake_case")]
pub enum GameMap {
    Autumn,
    Winter,
    Lake,
    Cave,
}

impl Default for GameMap {
    fn default() -> Self {
        Self::Autumn
    }
}
