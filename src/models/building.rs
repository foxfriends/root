use super::{BuildingId, FactionId};
use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "building")]
pub struct Building {
    id: i16,
    building: BuildingId,
    faction: FactionId,
}

impl Building {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, "SELECT id, building, faction FROM buildings WHERE game = $1", game).fetch_all(conn).await
    }
}
