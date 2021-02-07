use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "completed_quest")]
pub struct CompletedQuest {
    quest: i16,
    faction: FactionId,
}

#[async_trait]
impl Loadable for Vec<CompletedQuest> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            CompletedQuest,
            r#"SELECT quest, faction as "faction: _" FROM completed_quests WHERE game = $1"#,
            game
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Saveable for CompletedQuest {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO completed_quests (game, quest, faction) VALUES ($1, $2, $3) ON CONFLICT (game, quest) DO UPDATE SET faction = $3",
            game,
            self.quest,
            self.faction as FactionId,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
