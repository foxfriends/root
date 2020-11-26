use super::{EyrieLeader, FactionId};
use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "eyrie")]
pub struct Eyrie {
    faction: FactionId,
    used_leaders: Vec<EyrieLeader>,
    leader: Option<EyrieLeader>,
}

impl Eyrie {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Option<Self>> {
        query_as!(Self, "SELECT faction, used_leaders, leader FROM eyrie WHERE game = $1", game).fetch_optional(conn).await
    }
}
