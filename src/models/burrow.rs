use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "burrow")]
pub struct Burrow {
    warrior: i16,
}

impl Burrow {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, "SELECT warrior FROM burrow WHERE game = $1", game)
            .fetch_all(conn)
            .await
    }
}
