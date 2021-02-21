use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "quest")]
pub struct Quest {
    id: i16,
    quest: QuestId,
    suit: Suit,
}

impl Quest {
    pub fn new(id: i16, quest: QuestId, suit: Suit) -> Self {
        Self { id, quest, suit }
    }
}

#[async_trait]
impl Loadable for Vec<Quest> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            Quest,
            r#"SELECT id, quest as "quest: _", suit as "suit: _" FROM quests WHERE game = $1"#,
            game
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Saveable for Quest {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            r#"INSERT INTO quests (game, id, quest, suit) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING"#,
            game,
            self.id,
            self.quest as QuestId,
            self.suit as Suit,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}

#[async_trait]
impl Deletable for Quest {
    async fn delete(game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!("DELETE FROM quests WHERE game = $1", game)
            .execute(conn)
            .await?;
        Ok(())
    }
}
