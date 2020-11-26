use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "position")]
pub struct Position {
    id: i16,
}

impl Position {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, "SELECT id FROM positions WHERE game = $1", game).fetch_all(conn).await
    }
}
