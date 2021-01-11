use super::*;
use rand::{seq::SliceRandom, thread_rng};

/// The board component of a game.
///
/// TODO[#23]: Add the rest
pub struct Board {
    pub positions: Vec<Position>,
    pub clearings: Vec<Clearing>,
    pub forests: Vec<Forest>,
    pub water: Vec<Water>,
    pub ferry: Option<Ferry>,
    pub tower: Option<Tower>,
    pub connections: Vec<Connection>,
    pub rivers: Vec<River>,
    pub ruin_items: Vec<RuinItem>,
}

impl Board {
    pub fn create(map: GameMap, items: &[Item]) -> Self {
        match map {
            GameMap::Autumn => Self::autumn(items),
            _ => todo!("Other maps will be implemented eventually"),
        }
    }

    /// The Autumn map is laid out as follows:
    ///
    /// ```
    /// (1)------(6)----------\
    ///  |\      [13]          \
    ///  | \----(5)------------(2)
    ///  |  [14] |              |
    /// (10)__   |    [15]      |
    ///  |    \  |              |
    ///  |[16] (11)----(12)----(7)
    ///  | ___/   \ [18] \_[19]_/
    ///  |/  [17]  \       \  /
    /// (4)--(9)---(8)------(3)
    /// ```
    fn autumn(items: &[Item]) -> Self {
        let positions: Vec<Position> = (1..=19).map(Position::new).collect();
        let clearings = vec![
            Clearing::new(&positions[0], Suit::Fox, 1),
            Clearing::new(&positions[1], Suit::Mouse, 1),
            Clearing::new(&positions[2], Suit::Rabbit, 1),
            Clearing::new(&positions[3], Suit::Rabbit, 1),
            Clearing::new(&positions[4], Suit::Rabbit, 2),
            Clearing::new(&positions[5], Suit::Rabbit, 2),
            Clearing::new(&positions[6], Suit::Fox, 2),
            Clearing::new(&positions[7], Suit::Mouse, 2),
            Clearing::new(&positions[8], Suit::Fox, 2),
            Clearing::new(&positions[9], Suit::Mouse, 2),
            Clearing::new(&positions[10], Suit::Fox, 2),
            Clearing::new(&positions[11], Suit::Mouse, 3),
        ];
        let forests = vec![
            Forest::new(&positions[12]),
            Forest::new(&positions[13]),
            Forest::new(&positions[14]),
            Forest::new(&positions[15]),
            Forest::new(&positions[16]),
            Forest::new(&positions[17]),
            Forest::new(&positions[18]),
        ];
        let water = vec![
            Water::new(&clearings[3]),
            Water::new(&clearings[7]),
            Water::new(&clearings[11]),
            Water::new(&clearings[4]),
            Water::new(&clearings[5]),
        ];
        let connections = vec![
            Connection::new(&positions[0], &positions[4]),
            Connection::new(&positions[0], &positions[5]),
            Connection::new(&positions[0], &positions[9]),
            Connection::new(&positions[0], &positions[12]),
            Connection::new(&positions[0], &positions[13]),
            Connection::new(&positions[1], &positions[4]),
            Connection::new(&positions[1], &positions[5]),
            Connection::new(&positions[1], &positions[6]),
            Connection::new(&positions[1], &positions[12]),
            Connection::new(&positions[1], &positions[14]),
            Connection::new(&positions[2], &positions[6]),
            Connection::new(&positions[2], &positions[7]),
            Connection::new(&positions[2], &positions[11]),
            Connection::new(&positions[2], &positions[17]),
            Connection::new(&positions[2], &positions[18]),
            Connection::new(&positions[3], &positions[8]),
            Connection::new(&positions[3], &positions[9]),
            Connection::new(&positions[3], &positions[10]),
            Connection::new(&positions[3], &positions[15]),
            Connection::new(&positions[3], &positions[16]),
            Connection::new(&positions[4], &positions[10]),
            Connection::new(&positions[4], &positions[13]),
            Connection::new(&positions[4], &positions[14]),
            Connection::new(&positions[5], &positions[12]),
            Connection::new(&positions[6], &positions[11]),
            Connection::new(&positions[6], &positions[14]),
            Connection::new(&positions[6], &positions[18]),
            Connection::new(&positions[7], &positions[8]),
            Connection::new(&positions[7], &positions[16]),
            Connection::new(&positions[7], &positions[17]),
            Connection::new(&positions[8], &positions[16]),
            Connection::new(&positions[9], &positions[10]),
            Connection::new(&positions[9], &positions[13]),
            Connection::new(&positions[9], &positions[15]),
            Connection::new(&positions[10], &positions[11]),
            Connection::new(&positions[10], &positions[13]),
            Connection::new(&positions[10], &positions[14]),
            Connection::new(&positions[10], &positions[15]),
            Connection::new(&positions[10], &positions[16]),
            Connection::new(&positions[10], &positions[17]),
            Connection::new(&positions[11], &positions[14]),
            Connection::new(&positions[11], &positions[17]),
            Connection::new(&positions[11], &positions[18]),
            Connection::new(&positions[12], &positions[13]),
            Connection::new(&positions[12], &positions[14]),
            Connection::new(&positions[13], &positions[14]),
            Connection::new(&positions[13], &positions[15]),
            Connection::new(&positions[14], &positions[17]),
            Connection::new(&positions[14], &positions[18]),
            Connection::new(&positions[15], &positions[16]),
            Connection::new(&positions[16], &positions[17]),
            Connection::new(&positions[17], &positions[18]),
        ];
        let rivers = vec![
            River::new(&water[0], &water[1]),
            River::new(&water[1], &water[2]),
            River::new(&water[2], &water[3]),
            River::new(&water[3], &water[4]),
            River::new(&water[4], &water[5]),
        ];
        let mut item_ids: Vec<_> = items.iter().map(Item::id).collect();
        let mut rng = thread_rng();
        item_ids.shuffle(&mut rng);
        let ruin_items = item_ids
            .into_iter()
            .zip([5, 7, 11, 12].iter().copied().cycle())
            .map(|(item, clearing)| RuinItem::new(clearing, item))
            .collect();
        Self {
            positions,
            clearings,
            forests,
            water,
            ferry: None,
            tower: None,
            connections,
            rivers,
            ruin_items,
        }
    }
}
