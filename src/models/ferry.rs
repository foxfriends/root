use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "ferry")]
pub struct Ferry {
    clearing: i16,
}

impl Ferry {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Option<Self>> {
        query_as!(Self, "SELECT clearing FROM ferry WHERE game = $1", game)
            .fetch_optional(conn)
            .await
    }
}
