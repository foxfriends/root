#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize)]
pub enum GameMap {
    Forest,
    Winter,
    Lake,
    Cave,
}
