use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "active_quest")]
pub struct ActiveQuest {
    quest: i16,
}

impl ActiveQuest {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(
            Self,
            "SELECT quest FROM active_quests WHERE game = $1",
            game
        )
        .fetch_all(conn)
        .await
    }
}
