use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "ruin_item")]
pub struct RuinItem {
    clearing: i16,
    item: i16,
}

impl RuinItem {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(
            Self,
            "SELECT clearing, item FROM ruin_items WHERE game = $1",
            game
        )
        .fetch_all(conn)
        .await
    }
}
