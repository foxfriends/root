use super::*;
use rand::{seq::SliceRandom, thread_rng};

/// Which shared deck to use. Currently, only standard is supported.
#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize, sqlx::Type)]
#[serde(rename = "deck", rename_all = "snake_case")]
#[sqlx(type_name = "enum_deck", rename_all = "snake_case")]
pub enum Deck {
    Standard,
    ExilesAndPartisans,
}

impl Default for Deck {
    fn default() -> Self {
        Self::Standard
    }
}

impl Deck {
    pub fn create(self) -> (Vec<Card>, Vec<SharedDeck>) {
        match self {
            Self::Standard => Self::standard(),
            _ => todo!(),
        }
    }

    fn standard() -> (Vec<Card>, Vec<SharedDeck>) {
        let mut rng = thread_rng();
        let mut id: Vec<i16> = (1..=54).collect();
        let cards = vec![
            Card::new(id[0], CardId::Ambush, Suit::Bird),
            Card::new(id[1], CardId::Ambush, Suit::Bird),
            Card::new(id[2], CardId::BirdyBindle, Suit::Bird),
            Card::new(id[3], CardId::Armorers, Suit::Bird),
            Card::new(id[4], CardId::Armorers, Suit::Bird),
            Card::new(id[5], CardId::WoodlandRunners, Suit::Bird),
            Card::new(id[6], CardId::ArmsTrader, Suit::Bird),
            Card::new(id[7], CardId::Crossbow, Suit::Bird),
            Card::new(id[8], CardId::Sappers, Suit::Bird),
            Card::new(id[9], CardId::Sappers, Suit::Bird),
            Card::new(id[10], CardId::BrutalTactics, Suit::Bird),
            Card::new(id[11], CardId::BrutalTactics, Suit::Bird),
            Card::new(id[12], CardId::RoyalClaim, Suit::Bird),
            Card::new(id[13], CardId::Ambush, Suit::Fox),
            Card::new(id[14], CardId::GentlyUsedKnapsack, Suit::Fox),
            Card::new(id[15], CardId::RootTea, Suit::Fox),
            Card::new(id[16], CardId::TravelGear, Suit::Fox),
            Card::new(id[17], CardId::ProtectionRacket, Suit::Fox),
            Card::new(id[18], CardId::FoxfolkSteel, Suit::Fox),
            Card::new(id[19], CardId::Anvil, Suit::Fox),
            Card::new(id[20], CardId::StandAndDeliver, Suit::Fox),
            Card::new(id[21], CardId::StandAndDeliver, Suit::Fox),
            Card::new(id[22], CardId::TaxCollector, Suit::Fox),
            Card::new(id[23], CardId::TaxCollector, Suit::Fox),
            Card::new(id[24], CardId::TaxCollector, Suit::Fox),
            Card::new(id[25], CardId::FavorOfTheFoxes, Suit::Fox),
            Card::new(id[26], CardId::Ambush, Suit::Rabbit),
            Card::new(id[27], CardId::SmugglersTrail, Suit::Rabbit),
            Card::new(id[28], CardId::RootTea, Suit::Rabbit),
            Card::new(id[29], CardId::AVisitToFriends, Suit::Rabbit),
            Card::new(id[30], CardId::BakeSale, Suit::Rabbit),
            Card::new(id[31], CardId::CommandWarren, Suit::Rabbit),
            Card::new(id[32], CardId::CommandWarren, Suit::Rabbit),
            Card::new(id[33], CardId::BetterBurrowBank, Suit::Rabbit),
            Card::new(id[34], CardId::BetterBurrowBank, Suit::Rabbit),
            Card::new(id[35], CardId::Cobbler, Suit::Rabbit),
            Card::new(id[36], CardId::Cobbler, Suit::Rabbit),
            Card::new(id[37], CardId::FavorOfTheRabbits, Suit::Rabbit),
            Card::new(id[38], CardId::Ambush, Suit::Mouse),
            Card::new(id[39], CardId::MouseInASack, Suit::Mouse),
            Card::new(id[40], CardId::RootTea, Suit::Mouse),
            Card::new(id[41], CardId::TravelGear, Suit::Mouse),
            Card::new(id[42], CardId::Investments, Suit::Mouse),
            Card::new(id[43], CardId::Sword, Suit::Mouse),
            Card::new(id[44], CardId::Crossbow, Suit::Mouse),
            Card::new(id[45], CardId::ScoutingParty, Suit::Mouse),
            Card::new(id[46], CardId::ScoutingParty, Suit::Mouse),
            Card::new(id[47], CardId::Codebreakers, Suit::Mouse),
            Card::new(id[48], CardId::Codebreakers, Suit::Mouse),
            Card::new(id[49], CardId::FavorOfTheMice, Suit::Mouse),
            Card::new(id[50], CardId::Dominance, Suit::Fox),
            Card::new(id[51], CardId::Dominance, Suit::Rabbit),
            Card::new(id[52], CardId::Dominance, Suit::Mouse),
            Card::new(id[53], CardId::Dominance, Suit::Bird),
        ];
        id.shuffle(&mut rng);
        let shared_deck = id
            .into_iter()
            .enumerate()
            .map(|(sort, card)| SharedDeck {
                card,
                sort: sort as i16,
            })
            .collect();
        (cards, shared_deck)
    }
}
