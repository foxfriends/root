use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "owned_item")]
pub struct OwnedItem {
    item: i16,
    faction: FactionId,
}

#[async_trait]
impl Loadable for Vec<OwnedItem> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            OwnedItem,
            r#"SELECT item, faction as "faction: _" FROM owned_items WHERE game = $1"#,
            game
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Saveable for OwnedItem {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO owned_items (game, item, faction) VALUES ($1, $2, $3) ON CONFLICT (game, item) DO UPDATE SET faction = $3",
            game,
            self.item,
            self.faction as FactionId,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
