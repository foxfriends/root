use super::*;

/// The board component of a game.
///
/// TODO[#23]: Add the rest
pub struct Board {
    pub positions: Vec<Position>,
    pub clearings: Vec<Clearing>,
}

impl Board {
    pub fn create(map: GameMap) -> Self {
        match map {
            GameMap::Autumn => Self::autumn(),
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
    fn autumn() -> Self {
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
        Self {
            positions,
            clearings,
        }
    }
}
