use super::*;
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
}

#[async_trait]
impl Loadable for Vec<Position> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(Position, "SELECT id FROM positions WHERE game = $1", game)
            .fetch_all(conn)
            .await
    }
}

#[async_trait]
impl Saveable for Position {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
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

#[async_trait]
impl Deletable for Position {
    async fn delete(game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!("DELETE FROM positions WHERE game = $1", game)
            .execute(conn)
            .await?;
        Ok(())
    }
}
