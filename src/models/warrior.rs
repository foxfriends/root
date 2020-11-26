use super::FactionId;
use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "warrior")]
pub struct Warrior {
    id: i16,
    faction: FactionId,
}

impl Warrior {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, "SELECT id, faction FROM warriors WHERE game = $1", game).fetch_all(conn).await
    }
}
