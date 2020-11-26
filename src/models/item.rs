use super::ItemId;
use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "item")]
pub struct Item {
    id: i16,
    item: ItemId,
}

impl Item {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, "SELECT id, item FROM items WHERE game = $1", game).fetch_all(conn).await
    }
}
