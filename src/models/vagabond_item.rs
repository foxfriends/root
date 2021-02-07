use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "vagabond_item")]
pub struct VagabondItem {
    item: i16,
    faction: FactionId,
    exhausted: bool,
    damaged: bool,
}

#[async_trait]
impl Loadable for Vec<VagabondItem> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            VagabondItem,
            r#"SELECT item, faction as "faction: _", exhausted, damaged FROM vagabond_items WHERE game = $1"#,
            game,
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Saveable for VagabondItem {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "
                INSERT INTO vagabond_items (game, item, faction, exhausted, damaged) VALUES ($1, $2, $3, $4, $5)
                    ON CONFLICT (game, item) DO UPDATE SET faction = $3, exhausted = $4, damaged = $5
            ",
            game,
            self.item,
            self.faction as FactionId,
            self.exhausted,
            self.damaged,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
