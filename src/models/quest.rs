use super::{Suit, QuestId};
use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "quest")]
pub struct Quest {
    id: i16,
    quest: QuestId,
    suit: Suit,
}

impl Quest {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, "SELECT id, quest, suit FROM quests WHERE game = $1", game).fetch_all(conn).await
    }
}
