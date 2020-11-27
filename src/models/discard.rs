use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "discard")]
pub struct Discard {
    card: i16,
}

impl Discard {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, "SELECT card FROM discards WHERE game = $1", game)
            .fetch_all(conn)
            .await
    }
}
