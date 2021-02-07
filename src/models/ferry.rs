use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "ferry")]
pub struct Ferry {
    clearing: i16,
}

#[async_trait]
impl Loadable for Option<Ferry> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(Ferry, "SELECT clearing FROM ferry WHERE game = $1", game)
            .fetch_optional(conn)
            .await
    }
}

#[async_trait]
impl Saveable for Ferry {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!("INSERT INTO ferry (game, clearing) VALUES ($1, $2) ON CONFLICT (game) DO UPDATE SET clearing = $2", game, self.clearing)
            .execute(conn)
            .await?;
        Ok(())
    }
}
