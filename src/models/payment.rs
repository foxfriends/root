use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "payment")]
pub struct Payment {
    warrior: i16,
}

#[async_trait]
impl Loadable for Vec<Payment> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            Payment,
            "SELECT warrior FROM payments WHERE game = $1",
            game
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Saveable for Payment {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO payments (game, warrior) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            game,
            self.warrior
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}

#[async_trait]
impl Deletable for Payment {
    async fn delete(game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!("DELETE FROM payments WHERE game = $1", game)
            .execute(conn)
            .await?;
        Ok(())
    }
}
