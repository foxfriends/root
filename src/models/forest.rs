use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "forest")]
pub struct Forest {
    position: i16,
}

impl Forest {
    pub fn new(position: &Position) -> Self {
        Self {
            position: position.id(),
        }
    }
}

#[async_trait]
impl Loadable for Vec<Forest> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(Forest, "SELECT position FROM forests WHERE game = $1", game)
            .fetch_all(conn)
            .await
    }
}

#[async_trait]
impl Saveable for Forest {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO forests (game, position) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            game,
            self.position,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}

#[async_trait]
impl Deletable for Forest {
    async fn delete(game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!("DELETE FROM forests WHERE game = $1", game)
            .execute(conn)
            .await?;
        Ok(())
    }
}
