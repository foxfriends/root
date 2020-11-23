#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename = "map")]
#[serde(rename_all = "snake_case")]
pub enum GameMap {
    Autumn,
    Winter,
    Lake,
    Cave,
}
