use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "shared_deck")]
pub struct SharedDeck {
    pub card: i16,
    pub sort: i16,
}

#[async_trait]
impl Loadable for Vec<SharedDeck> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            SharedDeck,
            "SELECT card, sort FROM shared_deck WHERE game = $1 ORDER BY sort ASC",
            game
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Saveable for SharedDeck {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO shared_deck (game, card, sort) VALUES ($1, $2, $3) ON CONFLICT (game, card) DO UPDATE SET sort = $3",
            game,
            self.card,
            self.sort,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}

#[async_trait]
impl Deletable for SharedDeck {
    async fn delete(game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!("DELETE FROM shared_deck WHERE game = $1", game)
            .execute(conn)
            .await?;
        Ok(())
    }
}
