use super::Clearing;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "water")]
pub struct Water {
    clearing: i16,
}

impl Water {
    pub fn new(clearing: &Clearing) -> Self {
        Self {
            clearing: clearing.position(),
        }
    }

    pub fn position(&self) -> i16 {
        self.clearing
    }

    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, "SELECT clearing FROM water WHERE game = $1", game)
            .fetch_all(conn)
            .await
    }

    pub async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO water (game, clearing) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            game,
            self.clearing,
        ).execute(conn).await?;
        Ok(())
    }
}
