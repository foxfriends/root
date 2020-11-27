use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "lost_soul")]
pub struct LostSoul {
    card: i16,
}

impl LostSoul {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, "SELECT card FROM lost_souls WHERE game = $1", game).fetch_all(conn).await
    }
}
