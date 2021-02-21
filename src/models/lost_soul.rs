use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "lost_soul")]
pub struct LostSoul {
    card: i16,
}

#[async_trait]
impl Loadable for Vec<LostSoul> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            LostSoul,
            "SELECT card FROM lost_souls WHERE game = $1",
            game
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Saveable for LostSoul {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO lost_souls (game, card) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            game,
            self.card
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}

#[async_trait]
impl Deletable for LostSoul {
    async fn delete(game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!("DELETE FROM lost_souls WHERE game = $1", game)
            .execute(conn)
            .await?;
        Ok(())
    }
}
