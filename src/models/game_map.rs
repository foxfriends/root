#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename = "map")]
#[serde(rename_all = "camelCase")]
pub enum GameMap {
    Forest,
    Winter,
    Lake,
    Cave,
}
