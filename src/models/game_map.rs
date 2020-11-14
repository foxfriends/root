#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum GameMap {
    Forest,
    Winter,
    Lake,
    Cave,
}
