use super::*;

#[derive(Clone, Default, serde::Serialize, serde::Deserialize)]
#[serde(rename = "game")]
pub struct Game {
    name: String,
    assignment: Assignment,
    map: GameMap,
    phase: Phase,

    // General game state
    players: Vec<Player>,

    // Board setup
    positions: Vec<Position>,
    forests: Vec<Forest>,
    clearings: Vec<Clearing>,
    water: Vec<Water>,
    connections: Vec<Connection>,
    rivers: Vec<River>,
    ferry: Option<Ferry>,
    tower: Option<Tower>,

    factions: Vec<Faction>,

    buildings: Vec<Building>,
    built_buildings: Vec<BuiltBuilding>,

    tokens: Vec<Token>,
    placed_tokens: Vec<PlacedToken>,

    cards: Vec<Card>,
    discards: Vec<Discard>,
    hand: Vec<Hand>,

    items: Vec<Item>,
    owned_items: Vec<OwnedItem>,
    ruin_items: Vec<RuinItem>,

    warriors: Vec<Warrior>,
    placed_warriors: Vec<PlacedWarrior>,

    // Faction specific details
    marquise: Option<Marquise>,

    eyrie: Option<Eyrie>,
    eyrie_decree: Option<EyrieDecree>,

    alliance: Option<Alliance>,
    alliance_supporters: Vec<AllianceSupporter>,
    officers: Vec<Officer>,

    vagabond: Option<Vagabond>,
    vagabond2: Option<Vagabond>,
    vagabond_items: Vec<VagabondItem>,
    vagabond_relationships: Vec<VagabondRelationship>,
    quests: Vec<Quest>,
    active_quests: Vec<ActiveQuest>,
    completed_quests: Vec<CompletedQuest>,

    cult: Option<Cult>,
    acolytes: Vec<Acolyte>,
    lost_souls: Vec<LostSoul>,

    riverfolk: Option<Riverfolk>,
    commitments: Vec<Commitment>,
    funds: Vec<Fund>,
    payments: Vec<Payment>,

    duchy: Option<Duchy>,
    burrow: Vec<Burrow>,
    ministers: Vec<Minister>,

    conspiracy: Option<Conspiracy>,
}

impl Game {
    pub async fn load(name: &str) -> sqlx::Result<Self> {
        todo!()
    }

    pub async fn save(&self) -> sqlx::Result<()> {
        todo!()
    }
    
    pub fn create(config: GameConfig) -> Self {
        Game {
            name: config.name,
            assignment: config.assignment,
            map: config.map,
            ..Self::default()
        }
    }

    pub fn name(&self) -> &str {
        self.name.as_str()
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

    pub fn add_player(&mut self, name: &str) -> Result<(), String> {
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
        self.players.push(Player::new(name.to_owned()));
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
