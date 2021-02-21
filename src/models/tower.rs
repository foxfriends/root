use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "tower")]
pub struct Tower {
    clearing: i16,
}

#[async_trait]
impl Loadable for Option<Tower> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(Tower, "SELECT clearing FROM tower WHERE game = $1", game)
            .fetch_optional(conn)
            .await
    }
}

#[async_trait]
impl Overwritable for Tower {
    async fn overwrite(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!("INSERT INTO tower (game, clearing) VALUES ($1, $2) ON CONFLICT (game) DO UPDATE SET clearing = $2", game, self.clearing)
            .execute(conn)
            .await?;
        Ok(())
    }
}
