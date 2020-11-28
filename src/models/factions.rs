use super::*;
use rand::{seq::SliceRandom, thread_rng};
use std::iter::FromIterator;

/// The faction-specific components of the game, to be generated conditionally
/// given the factions that are to be included.
#[derive(Default)]
pub struct Factions {
    pub marquise: Option<Marquise>,

    pub eyrie: Option<Eyrie>,
    pub eyrie_leaders: Vec<EyrieLeader>,
    pub eyrie_current_leader: Option<EyrieCurrentLeader>,

    pub alliance: Option<Alliance>,
    pub officers: Vec<Officer>,

    pub vagabond: Option<Vagabond>,
    pub vagabond2: Option<Vagabond>,
    pub vagabond_relationships: Vec<VagabondRelationship>,
    pub quests: Vec<Quest>,

    pub cult: Option<Cult>,

    pub riverfolk: Option<Riverfolk>,

    pub duchy: Option<Duchy>,
    pub ministers: Vec<Minister>,

    pub conspiracy: Option<Conspiracy>,

    pub buildings: Vec<Building>,
    pub tokens: Vec<Token>,
    pub warriors: Vec<Warrior>,
}

impl Factions {
    fn add(&mut self, faction: FactionId) {
        match faction {
            FactionId::Marquise => self.add_marquise(),
            FactionId::Eyrie => self.add_eyrie(),
            FactionId::Alliance => self.add_alliance(),
            FactionId::Vagabond | FactionId::Vagabond2 => self.add_vagabond(faction),
            FactionId::Cult => self.add_cult(),
            FactionId::Riverfolk => self.add_riverfolk(),
            FactionId::Duchy => self.add_duchy(),
            _ => todo!(),
        }
    }

    fn add_building(&mut self, building: BuildingId, n: usize) {
        for _ in 0..n {
            self.buildings.push(Building::new(
                self.buildings.len() as i16 + 1,
                building,
                None,
            ));
        }
    }

    fn add_suited_building(&mut self, building: BuildingId, n: usize) {
        for suit in &[Suit::Fox, Suit::Mouse, Suit::Rabbit] {
            for _ in 0..n {
                self.buildings.push(Building::new(
                    self.buildings.len() as i16 + 1,
                    building,
                    Some(*suit),
                ));
            }
        }
    }

    fn add_token(&mut self, token: TokenId, n: usize) {
        for _ in 0..n {
            self.tokens
                .push(Token::new(self.tokens.len() as i16 + 1, token, None));
        }
    }

    fn add_suited_token(&mut self, token: TokenId, n: usize) {
        for suit in &[Suit::Fox, Suit::Mouse, Suit::Rabbit] {
            for _ in 0..n {
                self.tokens
                    .push(Token::new(self.tokens.len() as i16 + 1, token, Some(*suit)));
            }
        }
    }

    fn add_warriors(&mut self, faction: FactionId, n: usize) {
        for _ in 0..n {
            self.warriors
                .push(Warrior::new(self.warriors.len() as i16 + 1, faction));
        }
    }

    fn add_marquise(&mut self) {
        self.marquise = Some(Marquise::new());
        self.add_building(BuildingId::Sawmill, 6);
        self.add_building(BuildingId::Recruiter, 6);
        self.add_building(BuildingId::Workshop, 6);
        self.add_token(TokenId::Keep, 1);
        self.add_token(TokenId::Wood, 8);
        self.add_warriors(FactionId::Marquise, 25);
    }

    fn add_eyrie(&mut self) {
        self.eyrie = Some(Eyrie::new());
        self.add_building(BuildingId::Roost, 7);
        self.add_warriors(FactionId::Eyrie, 20);
        self.eyrie_leaders = EyrieLeaderId::all().map(EyrieLeader::new).collect();
        self.eyrie_current_leader = Some(EyrieCurrentLeader::new());
    }

    fn add_alliance(&mut self) {
        self.alliance = Some(Alliance::new());
        self.add_suited_building(BuildingId::Base, 1);
        self.add_token(TokenId::Sympathy, 10);
        self.add_warriors(FactionId::Alliance, 10);
    }

    fn add_vagabond(&mut self, faction: FactionId) {
        self.vagabond = Some(Vagabond::new(faction));
    }

    fn add_cult(&mut self) {
        self.cult = Some(Cult::new());
        self.add_suited_building(BuildingId::Garden, 5);
        self.add_warriors(FactionId::Cult, 25);
    }

    fn add_riverfolk(&mut self) {
        self.riverfolk = Some(Riverfolk::new());
        self.add_suited_token(TokenId::TradePost, 3);
        self.add_warriors(FactionId::Riverfolk, 15);
    }

    fn add_duchy(&mut self) {
        self.duchy = Some(Duchy::new());
        self.add_building(BuildingId::Market, 3);
        self.add_building(BuildingId::Citadel, 3);
        self.add_token(TokenId::Tunnel, 3);
        self.add_warriors(FactionId::Duchy, 20);
        self.ministers = MinisterId::all().map(Minister::new).collect();
    }

    fn finish_vagabonds(&mut self) {
        if self.vagabond.is_none() && self.vagabond2.is_none() {
            return;
        }
        let mut rng = thread_rng();
        let mut id: Vec<i16> = (1..=15).collect();
        id.shuffle(&mut rng);
        self.quests = vec![
            Quest::new(id[0], QuestId::GiveASpeech, Suit::Fox),
            Quest::new(id[1], QuestId::Errand, Suit::Fox),
            Quest::new(id[2], QuestId::Fundraising, Suit::Fox),
            Quest::new(id[3], QuestId::LogisticsHelp, Suit::Fox),
            Quest::new(id[4], QuestId::RepairAShed, Suit::Fox),
            Quest::new(id[5], QuestId::FendOffABear, Suit::Rabbit),
            Quest::new(id[6], QuestId::GiveASpeech, Suit::Rabbit),
            Quest::new(id[7], QuestId::Errand, Suit::Rabbit),
            Quest::new(id[8], QuestId::ExpelBandits, Suit::Rabbit),
            Quest::new(id[9], QuestId::GuardDuty, Suit::Rabbit),
            Quest::new(id[10], QuestId::Escort, Suit::Mouse),
            Quest::new(id[11], QuestId::ExpelBandits, Suit::Mouse),
            Quest::new(id[12], QuestId::FendOffABear, Suit::Mouse),
            Quest::new(id[13], QuestId::LogisticsHelp, Suit::Mouse),
            Quest::new(id[14], QuestId::GuardDuty, Suit::Mouse),
        ];
        for vagabond in self.vagabond.iter().chain(self.vagabond2.iter()) {
            let factions = self
                .marquise
                .iter()
                .map(|_| FactionId::Marquise)
                .chain(self.eyrie.iter().map(|_| FactionId::Eyrie))
                .chain(self.alliance.iter().map(|_| FactionId::Alliance))
                .chain(self.cult.iter().map(|_| FactionId::Cult))
                .chain(self.riverfolk.iter().map(|_| FactionId::Riverfolk))
                .chain(self.duchy.iter().map(|_| FactionId::Duchy))
                .chain(self.conspiracy.iter().map(|_| FactionId::Conspiracy));
            for faction in factions {
                self.vagabond_relationships
                    .push(VagabondRelationship::new(vagabond, faction));
            }
        }
    }
}

impl FromIterator<FactionId> for Factions {
    fn from_iter<I>(iter: I) -> Self
    where
        I: IntoIterator<Item = FactionId>,
    {
        let mut factions = Factions::default();
        for faction in iter {
            factions.add(faction);
        }
        factions.finish_vagabonds();
        factions
    }
}
