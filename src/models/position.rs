use sqlx::{postgres::PgConnection, query, query_as};

/// A position on the board where pieces can be placed (both clearings and forests).
#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "position")]
pub struct Position {
    /// The ID of this position (an arbitrary number).
    id: i16,
}

impl Position {
    /// Create a new position.
    pub fn new(id: i16) -> Self {
        Self { id }
    }

    /// The ID of this position.
    pub fn id(&self) -> i16 {
        self.id
    }

    /// Load the positions for a game from the database.
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, "SELECT id FROM positions WHERE game = $1", game)
            .fetch_all(conn)
            .await
    }

    /// Write this position to the database.
    pub async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO positions (game, id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            game,
            self.id
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
