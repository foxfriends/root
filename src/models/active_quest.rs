use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "active_quest")]
pub struct ActiveQuest {
    quest: i16,
}

#[async_trait]
impl Loadable for Vec<ActiveQuest> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            ActiveQuest,
            "SELECT quest FROM active_quests WHERE game = $1",
            game
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Saveable for ActiveQuest {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO active_quests (game, quest) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            game,
            self.quest
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}

#[async_trait]
impl Deletable for ActiveQuest {
    async fn delete(game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!("DELETE FROM active_quests WHERE game = $1", game)
            .execute(conn)
            .await?;
        Ok(())
    }
}
