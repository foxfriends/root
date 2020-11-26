use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "tower")]
pub struct Tower { clearing: i16 }

impl Tower {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Option<Self>> {
        query_as!(Self, "SELECT clearing FROM tower WHERE game = $1", game).fetch_optional(conn).await
    }
}
