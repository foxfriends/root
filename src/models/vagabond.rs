use super::{VagabondId, FactionId};
use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "vagabond")]
pub struct Vagabond {
    faction: FactionId,
    vagabond: VagabondId,
    position: i16,
}

impl Vagabond {
    pub async fn load(game: &str, faction: FactionId, conn: &mut PgConnection) -> sqlx::Result<Option<Self>> {
        query_as!(Self, "SELECT faction, vagabond, position FROM vagabond WHERE game = $1 AND faction = $2", game, faction).fetch_optional(conn).await
    }
}
