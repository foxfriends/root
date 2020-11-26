use super::FactionId;
use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "vagabond_item")]
pub struct VagabondItem {
    item: i16,
    faction: FactionId,
    exhausted: bool,
    damaged: bool,
}

impl VagabondItem {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, "SELECT item, faction, exhausted, damaged FROM vagabond_items WHERE game = $1", game).fetch_all(conn).await
    }
}
