use super::FactionId;
use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "completed_quest")]
pub struct CompletedQuest {
    quest: i16,
    faction: FactionId,
}

impl CompletedQuest {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, "SELECT quest, faction FROM completed_quests WHERE game = $1", game).fetch_all(conn).await
    }
}
