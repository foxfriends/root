use super::FactionId;
use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "riverfolk")]
pub struct Riverfolk {
    faction: FactionId,
    hand_card: i16,
    riverboats: i16,
    mercenaries: i16,
}

impl Riverfolk {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Option<Self>> {
        query_as!(Self, "SELECT faction, hand_card, riverboats, mercenaries FROM riverfolk WHERE game = $1", game).fetch_optional(conn).await
    }
}
