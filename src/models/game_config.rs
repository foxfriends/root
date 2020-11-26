use super::{Assignment, FactionId, GameMap};

#[derive(Clone, Eq, PartialEq, Debug, serde::Deserialize)]
pub struct GameConfig {
    pub name: String,
    pub(super) factions: Vec<FactionId>,
    pub(super) assignment: Assignment,
    pub(super) map: GameMap,
}
