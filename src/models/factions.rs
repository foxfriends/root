use super::*;
use std::iter::FromIterator;

/// The faction-specific components of the game, to be generated conditionally
/// given the factions that are to be included.
#[derive(Default)]
pub struct Factions {
    pub marquise: Option<Marquise>,

    pub eyrie: Option<Eyrie>,
    pub eyrie_decree: Vec<EyrieDecree>,
    pub eyrie_leaders: Vec<EyrieLeader>,
    pub eyrie_current_leader: Option<EyrieCurrentLeader>,

    pub alliance: Option<Alliance>,
    pub alliance_supporters: Vec<AllianceSupporter>,
    pub officers: Vec<Officer>,

    pub vagabond: Option<Vagabond>,
    pub vagabond2: Option<Vagabond>,
    pub vagabond_items: Vec<VagabondItem>,
    pub vagabond_relationships: Vec<VagabondRelationship>,
    pub quests: Vec<Quest>,
    pub active_quests: Vec<ActiveQuest>,
    pub completed_quests: Vec<CompletedQuest>,
    pub coalition: Vec<Coalition>,

    pub cult: Option<Cult>,
    pub acolytes: Vec<Acolyte>,
    pub lost_souls: Vec<LostSoul>,

    pub riverfolk: Option<Riverfolk>,
    pub commitments: Vec<Commitment>,
    pub funds: Vec<Fund>,
    pub payments: Vec<Payment>,

    pub duchy: Option<Duchy>,
    pub burrow: Vec<Burrow>,
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
            _ => todo!(),
        }
    }

    fn add_building(&mut self, building: BuildingId, n: usize) {
        for _ in 0..n {
            self.buildings
                .push(Building::new(self.buildings.len() as i16 + 1, building));
        }
    }

    fn add_token(&mut self, token: TokenId, n: usize) {
        for _ in 0..n {
            self.tokens
                .push(Token::new(self.tokens.len() as i16 + 1, token));
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
        factions
    }
}
