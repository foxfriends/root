use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "fund")]
pub struct Fund {
    warrior: i16,
}

#[async_trait]
impl Loadable for Vec<Fund> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(Fund, "SELECT warrior FROM funds WHERE game = $1", game)
            .fetch_all(conn)
            .await
    }
}

#[async_trait]
impl Saveable for Fund {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO funds (game, warrior) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            game,
            self.warrior,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}

#[async_trait]
impl Deletable for Fund {
    async fn delete(game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!("DELETE FROM funds WHERE game = $1", game)
            .execute(conn)
            .await?;
        Ok(())
    }
}
