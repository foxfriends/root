use super::{Assignment, Faction, GameConfig, GameMap, Phase, Player};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
pub struct Game {
    name: String,
    factions: Vec<Faction>,
    assignment: Assignment,
    map: GameMap,
    players: Vec<Player>,
    phase: Phase,
}

impl Game {
    pub fn create(config: GameConfig) -> Self {
        Game {
            name: config.name,
            factions: config.factions,
            assignment: config.assignment,
            map: config.map,
            players: vec![],
            phase: Phase::Lobby,
        }
    }

    pub fn phase(&self) -> Phase {
        self.phase
    }

    pub fn players(&self) -> &[Player] {
        self.players.as_slice()
    }

    pub fn factions(&self) -> &[Faction] {
        self.factions.as_slice()
    }

    pub fn add_player(&mut self, name: String) -> Result<(), String> {
        if self.phase != Phase::Lobby {
            return Err("Players cannot be changed once the game has started.".into());
        }
        let is_existing_player = self.players.iter().any(|player| player.name() == name);
        if is_existing_player {
            return Err(format!(
                "There is already a player named {} in this game.",
                name
            ));
        }
        if self.players.len() == self.factions.len() {
            return Err("This game is already full.".into());
        }
        self.players.push(Player::new(name));
        Ok(())
    }

    pub fn remove_player(&mut self, name: &str) -> Result<(), String> {
        if self.phase != Phase::Lobby {
            return Err("Players cannot be changed once the game has started.".into());
        }
        let index = self.players.iter().position(|player| player.name() == name);
        if let Some(index) = index {
            self.players.remove(index);
        }
        Ok(())
    }
}
