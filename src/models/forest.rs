use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "forest")]
pub struct Forest {
    position: i16,
}

impl Forest {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, "SELECT position FROM forests WHERE game = $1", game)
            .fetch_all(conn)
            .await
    }
}
