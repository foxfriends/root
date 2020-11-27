use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "built_building")]
pub struct BuiltBuilding {
    building: i16,
    position: i16,
}

impl BuiltBuilding {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, "SELECT building, position FROM built_buildings WHERE game = $1", game).fetch_all(conn).await
    }
}