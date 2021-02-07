use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "burrow")]
pub struct Burrow {
    warrior: i16,
}

#[async_trait]
impl Loadable for Vec<Burrow> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(Burrow, "SELECT warrior FROM burrow WHERE game = $1", game)
            .fetch_all(conn)
            .await
    }
}

#[async_trait]
impl Saveable for Burrow {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO burrow (game, warrior) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            game,
            self.warrior
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
