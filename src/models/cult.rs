use super::{Suit, FactionId};
use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "cult")]
pub struct Cult {
    faction: FactionId,
    outcast: Suit,
    hated_outcast: bool,
}

impl Cult {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Option<Self>> {
        query_as!(Self, "SELECT faction, outcast, hated_outcast FROM cult WHERE game = $1", game).fetch_optional(conn).await
    }
}
