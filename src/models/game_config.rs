use super::{Assignment, Faction, GameMap};

#[derive(Clone, Eq, PartialEq, Debug, serde::Deserialize)]
pub struct GameConfig {
    pub name: String,
    pub(super) factions: Vec<Faction>,
    pub(super) assignment: Assignment,
    pub(super) map: GameMap,
}
