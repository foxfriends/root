use super::*;
use sqlx::{query, query_scalar};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "game")]
pub struct Game {
    /// A name for the game.
    name: String,
    /// The method by which to assign factions to players.
    assignment: Assignment,
    /// Which map the game is being played on.
    map: GameMap,
    /// What phase of the game it is.
    phase: Phase,
    /// Faction whose turn it is currently.
    turn: FactionId,
    /// The current action number, for tracking state within a phase.
    action: i16,
    /// Which shared deck to use.
    deck: Deck,

    // General game state
    players: Vec<Player>,

    // Board setup
    /// The list of all positions on the board (where other pieces may be placed).
    positions: Vec<Position>,
    /// Identifies positions which are forests.
    forests: Vec<Forest>,
    /// Identifies positions which are clearings, along with details about that clearing.
    clearings: Vec<Clearing>,
    /// Whether a clearing has water (relevant for the Riverfolk).
    water: Vec<Water>,
    /// Which positions are connected (by paths or by being an adjacent forest).
    connections: Vec<Connection>,
    /// The clearings which are connected by rivers.
    rivers: Vec<River>,
    /// The current location of the ferry, if a ferry is in play (lake map).
    ferry: Option<Ferry>,
    /// The current location of the tower, if the tower is in play (mountain map).
    tower: Option<Tower>,

    /// Basic information about the factions in play. The order in this list determines
    /// the turn order. Note that setup order is always the order defined in [`FactionId`][].
    factions: Vec<Faction>,

    /// The buildings pieces that are available in this game.
    buildings: Vec<Building>,
    /// The positions of buildings that are on the board.
    built_buildings: Vec<BuiltBuilding>,

    /// The token pieces that are available in this game.
    tokens: Vec<Token>,
    /// The positions of tokens that are on the board.
    placed_tokens: Vec<PlacedToken>,

    /// The identifications of each card.
    cards: Vec<Card>,
    /// The current state of the shared deck.
    ///
    /// A card should be in one of:
    /// *   `shared_deck`
    /// *   `hand`
    /// *   `discards`
    /// *   `lost_souls`
    shared_deck: Vec<SharedDeck>,
    /// The order of cards in the discard pile.
    discards: Vec<Discard>,
    /// The cards in each player's hand.
    hand: Vec<Hand>,
    /// The dominance cards that have been activated.
    dominance: Vec<Dominance>,

    /// The identifications of each item in the game.
    items: Vec<Item>,
    /// The items in each player's Owned Items box.
    owned_items: Vec<OwnedItem>,
    /// The items under ruins.
    ruin_items: Vec<RuinItem>,

    /// The identifications of each warrior.
    warriors: Vec<Warrior>,
    /// The positions of warriors that are on the board.
    placed_warriors: Vec<PlacedWarrior>,

    // Faction specific details
    /// Marquise specific state information.
    marquise: Option<Marquise>,

    /// Eyrie specific state information.
    eyrie: Option<Eyrie>,
    /// Cards in the Eyrie's decree.
    eyrie_decree: Vec<EyrieDecree>,
    /// Definitions of each available Eyrie Leader.
    eyrie_leaders: Vec<EyrieLeader>,
    /// The currently selected Eyrie Leader. May be none if they currently need to pick one.
    eyrie_current_leader: Option<EyrieCurrentLeader>,

    /// Alliance specific state information.
    alliance: Option<Alliance>,
    /// Cards currently in the Alliance supporters stack.
    alliance_supporters: Vec<AllianceSupporter>,
    /// alliance warriors which have been designated as officers.
    officers: Vec<Officer>,

    /// Vagabond specific state information (for the first Vagabond).
    vagabond: Option<Vagabond>,
    /// Vagabond specific state information (for the second Vagabond).
    vagabond2: Option<Vagabond>,
    /// The state of items currently owned by the vagabond.
    vagabond_items: Vec<VagabondItem>,
    /// The relationships the vagabond has with each other player.
    vagabond_relationships: Vec<VagabondRelationship>,
    /// The list of all quests, in order they will be drawn.
    quests: Vec<Quest>,
    /// The currently available quests.
    active_quests: Vec<ActiveQuest>,
    /// The quests which have been completed by each Vagabond.
    completed_quests: Vec<CompletedQuest>,
    /// Any coalitions a Vagabond has formed.
    coalition: Vec<Coalition>,

    /// Cult specific state information.
    cult: Option<Cult>,
    /// Warriors that have been designated as Cult acolytes.
    acolytes: Vec<Acolyte>,
    /// The current lost souls stack.
    lost_souls: Vec<LostSoul>,

    /// Riverfolk specific state information.
    riverfolk: Option<Riverfolk>,
    /// Warriors in the commitments area.
    commitments: Vec<Commitment>,
    /// Warriors in the funds area.
    funds: Vec<Fund>,
    /// Warriors in the payments area.
    payments: Vec<Payment>,

    /// Duchy specific state information.
    duchy: Option<Duchy>,
    /// Warriors currently in the Burrow.
    burrow: Vec<Burrow>,
    /// Ministers that are available to the Duchy.
    ministers: Vec<Minister>,

    /// Conspiracy specific state information.
    conspiracy: Option<Conspiracy>,
}

impl Game {
    #[allow(clippy::eval_order_dependence)]
    pub async fn load(name: &str) -> sqlx::Result<Self> {
        let mut conn = crate::POOL.get().unwrap().begin().await?;
        let game = query!(
            r#"
                SELECT assignment as "assignment: Assignment",
                       map as "map: GameMap",
                       phase as "phase: Phase",
                       deck as "deck: Deck",
                       turn as "turn: FactionId",
                       action
                  FROM games
                 WHERE name = $1"#,
            name
        )
        .fetch_one(&mut conn)
        .await?;
        let game = Self {
            name: name.to_owned(),
            assignment: game.assignment,
            map: game.map,
            turn: game.turn,
            phase: game.phase,
            action: game.action,
            deck: game.deck,
            players: Loadable::load(name, &mut conn).await?,
            positions: Loadable::load(name, &mut conn).await?,
            forests: Loadable::load(name, &mut conn).await?,
            clearings: Loadable::load(name, &mut conn).await?,
            water: Loadable::load(name, &mut conn).await?,
            connections: Loadable::load(name, &mut conn).await?,
            rivers: Loadable::load(name, &mut conn).await?,
            ferry: Loadable::load(name, &mut conn).await?,
            tower: Loadable::load(name, &mut conn).await?,
            factions: Loadable::load(name, &mut conn).await?,
            buildings: Loadable::load(name, &mut conn).await?,
            built_buildings: Loadable::load(name, &mut conn).await?,
            tokens: Loadable::load(name, &mut conn).await?,
            placed_tokens: Loadable::load(name, &mut conn).await?,
            cards: Loadable::load(name, &mut conn).await?,
            shared_deck: Loadable::load(name, &mut conn).await?,
            discards: Loadable::load(name, &mut conn).await?,
            hand: Loadable::load(name, &mut conn).await?,
            dominance: Loadable::load(name, &mut conn).await?,
            items: Loadable::load(name, &mut conn).await?,
            owned_items: Loadable::load(name, &mut conn).await?,
            ruin_items: Loadable::load(name, &mut conn).await?,
            warriors: Loadable::load(name, &mut conn).await?,
            placed_warriors: Loadable::load(name, &mut conn).await?,
            marquise: Loadable::load(name, &mut conn).await?,
            eyrie: Loadable::load(name, &mut conn).await?,
            eyrie_decree: Loadable::load(name, &mut conn).await?,
            eyrie_leaders: Loadable::load(name, &mut conn).await?,
            eyrie_current_leader: Loadable::load(name, &mut conn).await?,
            alliance: Loadable::load(name, &mut conn).await?,
            alliance_supporters: Loadable::load(name, &mut conn).await?,
            officers: Loadable::load(name, &mut conn).await?,
            vagabond: Vagabond::load(name, FactionId::Vagabond, &mut conn).await?,
            vagabond2: Vagabond::load(name, FactionId::Vagabond2, &mut conn).await?,
            vagabond_items: Loadable::load(name, &mut conn).await?,
            vagabond_relationships: Loadable::load(name, &mut conn).await?,
            coalition: Loadable::load(name, &mut conn).await?,
            quests: Loadable::load(name, &mut conn).await?,
            active_quests: Loadable::load(name, &mut conn).await?,
            completed_quests: Loadable::load(name, &mut conn).await?,
            cult: Loadable::load(name, &mut conn).await?,
            acolytes: Loadable::load(name, &mut conn).await?,
            lost_souls: Loadable::load(name, &mut conn).await?,
            riverfolk: Loadable::load(name, &mut conn).await?,
            commitments: Loadable::load(name, &mut conn).await?,
            funds: Loadable::load(name, &mut conn).await?,
            payments: Loadable::load(name, &mut conn).await?,
            duchy: Loadable::load(name, &mut conn).await?,
            burrow: Loadable::load(name, &mut conn).await?,
            ministers: Loadable::load(name, &mut conn).await?,
            conspiracy: Loadable::load(name, &mut conn).await?,
        };
        conn.commit().await?;
        Ok(game)
    }

    pub async fn save(&self) -> sqlx::Result<()> {
        let mut conn = crate::POOL.get().unwrap().begin().await?;
        query!(
            r#"
                INSERT INTO games (name, assignment, map, deck, phase, turn, action)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    ON CONFLICT (name) DO UPDATE
                    SET phase = $5, turn = $6, action = $7
            "#,
            self.name,
            self.assignment as Assignment,
            self.map as GameMap,
            self.deck as Deck,
            self.phase as Phase,
            self.turn as FactionId,
            self.action,
        )
        .execute(&mut conn)
        .await?;

        self.players.overwrite(&self.name, &mut conn).await?;
        self.positions.overwrite(&self.name, &mut conn).await?;
        self.forests.overwrite(&self.name, &mut conn).await?;
        self.clearings.overwrite(&self.name, &mut conn).await?;
        self.water.overwrite(&self.name, &mut conn).await?;
        self.connections.overwrite(&self.name, &mut conn).await?;
        self.rivers.overwrite(&self.name, &mut conn).await?;
        self.ferry.overwrite(&self.name, &mut conn).await?;
        self.tower.overwrite(&self.name, &mut conn).await?;
        self.factions.overwrite(&self.name, &mut conn).await?;
        self.buildings.overwrite(&self.name, &mut conn).await?;
        self.built_buildings.save(&self.name, &mut conn).await?;
        self.tokens.overwrite(&self.name, &mut conn).await?;
        self.placed_tokens.save(&self.name, &mut conn).await?;
        self.cards.overwrite(&self.name, &mut conn).await?;
        self.shared_deck.save(&self.name, &mut conn).await?;
        self.discards.save(&self.name, &mut conn).await?;
        self.hand.save(&self.name, &mut conn).await?;
        self.dominance.save(&self.name, &mut conn).await?;
        self.items.overwrite(&self.name, &mut conn).await?;
        self.owned_items.overwrite(&self.name, &mut conn).await?;
        self.ruin_items.overwrite(&self.name, &mut conn).await?;
        self.warriors.overwrite(&self.name, &mut conn).await?;
        self.placed_warriors.save(&self.name, &mut conn).await?;
        self.marquise.overwrite(&self.name, &mut conn).await?;
        self.eyrie.overwrite(&self.name, &mut conn).await?;
        self.eyrie_decree.save(&self.name, &mut conn).await?;
        self.eyrie_leaders.overwrite(&self.name, &mut conn).await?;
        self.eyrie_current_leader
            .overwrite(&self.name, &mut conn)
            .await?;
        self.alliance.overwrite(&self.name, &mut conn).await?;
        self.alliance_supporters.save(&self.name, &mut conn).await?;
        self.officers.save(&self.name, &mut conn).await?;
        self.vagabond.overwrite(&self.name, &mut conn).await?;
        self.vagabond2.overwrite(&self.name, &mut conn).await?;
        self.vagabond_items.overwrite(&self.name, &mut conn).await?;
        self.vagabond_relationships
            .overwrite(&self.name, &mut conn)
            .await?;
        self.coalition.save(&self.name, &mut conn).await?;
        self.quests.overwrite(&self.name, &mut conn).await?;
        self.active_quests.save(&self.name, &mut conn).await?;
        self.completed_quests.save(&self.name, &mut conn).await?;
        self.cult.overwrite(&self.name, &mut conn).await?;
        self.acolytes.save(&self.name, &mut conn).await?;
        self.lost_souls.save(&self.name, &mut conn).await?;
        self.riverfolk.overwrite(&self.name, &mut conn).await?;
        self.commitments.save(&self.name, &mut conn).await?;
        self.funds.save(&self.name, &mut conn).await?;
        self.payments.save(&self.name, &mut conn).await?;
        self.duchy.overwrite(&self.name, &mut conn).await?;
        self.burrow.save(&self.name, &mut conn).await?;
        self.ministers.overwrite(&self.name, &mut conn).await?;
        self.conspiracy.overwrite(&self.name, &mut conn).await?;

        conn.commit().await?;
        Ok(())
    }

    pub async fn exists(name: &str) -> sqlx::Result<bool> {
        let mut conn = crate::POOL.get().unwrap().acquire().await?;
        Ok(
            query_scalar!("SELECT EXISTS (SELECT 1 FROM games WHERE name = $1)", name)
                .fetch_one(&mut conn)
                .await?
                .unwrap_or(false),
        )
    }

    pub async fn delete(&self) -> sqlx::Result<()> {
        let mut conn = crate::POOL.get().unwrap().acquire().await?;
        query!("DELETE FROM games WHERE name = $1", self.name)
            .execute(&mut conn)
            .await?;
        Ok(())
    }

    pub async fn create(config: GameConfig) -> sqlx::Result<Self> {
        let (cards, shared_deck) = config.deck.create();
        let dominance = cards
            .iter()
            .filter(|card| card.card() == CardId::Dominance)
            .map(Card::id)
            .map(Dominance::new)
            .collect();
        let Factions {
            marquise,
            eyrie,
            eyrie_leaders,
            eyrie_current_leader,
            alliance,
            officers,
            vagabond,
            vagabond2,
            vagabond_relationships,
            quests,
            cult,
            riverfolk,
            duchy,
            ministers,
            conspiracy,
            buildings,
            tokens,
            warriors,
            ..
        } = config.factions.iter().copied().collect();
        let mut items = vec![
            Item::new(1, ItemId::Boot),
            Item::new(2, ItemId::Boot),
            Item::new(3, ItemId::Bag),
            Item::new(4, ItemId::Bag),
            Item::new(5, ItemId::Crossbow),
            Item::new(6, ItemId::Hammer),
            Item::new(7, ItemId::Dagger),
            Item::new(8, ItemId::Dagger),
            Item::new(9, ItemId::Tea),
            Item::new(10, ItemId::Tea),
            Item::new(11, ItemId::Coin),
            Item::new(12, ItemId::Coin),
            Item::new(13, ItemId::Bag),
            Item::new(14, ItemId::Boot),
            Item::new(15, ItemId::Hammer),
            Item::new(16, ItemId::Dagger),
        ];
        if vagabond.is_some() && vagabond2.is_some() {
            items.push(Item::new(17, ItemId::Bag));
            items.push(Item::new(18, ItemId::Boot));
            items.push(Item::new(19, ItemId::Hammer));
            items.push(Item::new(20, ItemId::Dagger));
        }
        let Board {
            positions,
            clearings,
            forests,
            water,
            ferry,
            tower,
            connections,
            rivers,
            ruin_items,
        } = Board::create(config.map, &items[12..]);

        let game = Game {
            assignment: config.assignment,
            map: config.map,
            deck: config.deck,
            phase: Phase::default(),
            turn: FactionId::setup_order()
                .find(|faction| config.factions.contains(faction))
                .unwrap(),
            name: config.name,
            action: 0,
            players: vec![],
            factions: config
                .factions
                .iter()
                .map(|faction| Faction::new(*faction))
                .collect(),
            positions,
            clearings,
            forests,
            water,
            ferry,
            tower,
            connections,
            rivers,
            cards,
            shared_deck,
            discards: vec![],
            hand: vec![],
            dominance,
            marquise,
            eyrie,
            eyrie_decree: vec![],
            eyrie_leaders,
            eyrie_current_leader,
            alliance,
            alliance_supporters: vec![],
            officers,
            vagabond,
            vagabond2,
            vagabond_items: vec![],
            vagabond_relationships,
            coalition: vec![],
            quests,
            active_quests: vec![],
            completed_quests: vec![],
            cult,
            acolytes: vec![],
            lost_souls: vec![],
            riverfolk,
            commitments: vec![],
            payments: vec![],
            funds: vec![],
            duchy,
            burrow: vec![],
            ministers,
            conspiracy,
            buildings,
            built_buildings: vec![],
            tokens,
            placed_tokens: vec![],
            warriors,
            placed_warriors: vec![],
            items,
            owned_items: vec![],
            ruin_items,
        };
        game.save().await?;
        Ok(game)
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
