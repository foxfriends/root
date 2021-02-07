use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "discard")]
pub struct Discard {
    card: i16,
}

#[async_trait]
impl Loadable for Vec<Discard> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(Discard, "SELECT card FROM discards WHERE game = $1", game)
            .fetch_all(conn)
            .await
    }
}

#[async_trait]
impl Saveable for Discard {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO discards (game, card) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            game,
            self.card
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
