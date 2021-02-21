use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "river")]
pub struct River {
    position_a: i16,
    position_b: i16,
}

impl River {
    pub fn new(position_a: &Water, position_b: &Water) -> Self {
        let a = std::cmp::min(position_a.position(), position_b.position());
        let b = std::cmp::max(position_a.position(), position_b.position());
        Self {
            position_a: a,
            position_b: b,
        }
    }
}

#[async_trait]
impl Loadable for Vec<River> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            River,
            "SELECT position_a, position_b FROM rivers WHERE game = $1",
            game
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Saveable for River {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO rivers (game, position_a, position_b) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
            game,
            self.position_a,
            self.position_b,
        ).execute(conn).await?;
        Ok(())
    }
}

#[async_trait]
impl Deletable for River {
    async fn delete(game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!("DELETE FROM rivers WHERE game = $1", game)
            .execute(conn)
            .await?;
        Ok(())
    }
}
