use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "alliance_supporter")]
pub struct AllianceSupporter {
    card: i16,
}

#[async_trait]
impl Loadable for Vec<AllianceSupporter> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            AllianceSupporter,
            "SELECT card FROM alliance_supporters WHERE game = $1",
            game
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Saveable for AllianceSupporter {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO alliance_supporters (game, card) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            game,
            self.card
        )
        .fetch_all(conn)
        .await?;
        Ok(())
    }
}
