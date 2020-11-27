use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "officer")]
pub struct Officer {
    warrior: i16,
}

impl Officer {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, "SELECT warrior FROM officers WHERE game = $1", game).fetch_all(conn).await
    }
}
