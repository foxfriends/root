use super::{Position, Suit};
use sqlx::{postgres::PgConnection, query, query_as};

/// Marks a position as representing a clearing with the given suit and slots.
#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "clearing")]
pub struct Clearing {
    /// The position that is being marked as a clearing.
    position: i16,
    /// The suit of this clearing.
    suit: Suit,
    /// The number of building slots in this clearing.
    slots: i16,
}

impl Clearing {
    /// Creates a new clearing at the specified position.
    pub fn new(position: &Position, suit: Suit, slots: i16) -> Self {
        Self {
            position: position.id(),
            suit,
            slots,
        }
    }

    pub fn position(&self) -> i16 {
        self.position
    }

    /// Load the clearings for a game from the database.
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(
            Self,
            r#"SELECT position, suit as "suit: _", slots FROM clearings WHERE game = $1"#,
            game
        )
        .fetch_all(conn)
        .await
    }

    /// Write this clearing to the database.
    pub async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO clearings (game, position, suit, slots) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING",
            game,
            self.position,
            self.suit as Suit,
            self.slots,
        ).execute(conn).await?;
        Ok(())
    }
}
