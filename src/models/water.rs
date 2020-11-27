use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "water")]
pub struct Water { clearing: i16 }

impl Water {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, "SELECT clearing FROM water WHERE game = $1", game).fetch_all(conn).await
    }
}
