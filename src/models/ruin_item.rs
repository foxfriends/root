use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "ruin_item")]
pub struct RuinItem {
    clearing: Option<i16>,
    item: i16,
}

impl RuinItem {
    pub fn new(clearing: i16, item: i16) -> Self {
        Self {
            clearing: Some(clearing),
            item,
        }
    }
}

#[async_trait]
impl Loadable for Vec<RuinItem> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            RuinItem,
            "SELECT clearing, item FROM ruin_items WHERE game = $1",
            game
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Saveable for RuinItem {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO ruin_items (game, clearing, item) VALUES ($1, $2, $3) ON CONFLICT (game, item) DO UPDATE SET clearing = $2",
            game,
            self.clearing,
            self.item,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}

#[async_trait]
impl Deletable for RuinItem {
    async fn delete(game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!("DELETE FROM ruin_items WHERE game = $1", game)
            .execute(conn)
            .await?;
        Ok(())
    }
}
