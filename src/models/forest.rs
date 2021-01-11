use super::Position;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "forest")]
pub struct Forest {
    position: i16,
}

impl Forest {
    pub fn new(position: &Position) -> Self {
        Self {
            position: position.id(),
        }
    }

    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, "SELECT position FROM forests WHERE game = $1", game)
            .fetch_all(conn)
            .await
    }

    pub async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO forests (game, position) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            game,
            self.position,
        ).execute(conn).await?;
        Ok(())
    }
}
