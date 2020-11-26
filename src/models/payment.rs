use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "payment")]
pub struct Payment {
    warrior: i16,
}

impl Payment {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, "SELECT warrior FROM payments WHERE game = $1", game).fetch_all(conn).await
    }
}
