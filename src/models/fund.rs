use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "fund")]
pub struct Fund {
    warrior: i16,
}

impl Fund {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, "SELECT warrior FROM funds WHERE game = $1", game).fetch_all(conn).await
    }
}
