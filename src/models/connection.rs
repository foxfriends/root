use super::Position;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "connection")]
pub struct Connection {
    position_a: i16,
    position_b: i16,
    closed: bool,
}

impl Connection {
    pub fn new(position_a: &Position, position_b: &Position) -> Self {
        let a = std::cmp::min(position_a.id(), position_b.id());
        let b = std::cmp::max(position_a.id(), position_b.id());
        Self { position_a: a, position_b: b, closed: false }
    }
    
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(
            Self,
            "SELECT position_a, position_b, closed FROM connections WHERE game = $1",
            game
        )
        .fetch_all(conn)
        .await
    }

    pub async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO connections (game, position_a, position_b, closed) VALUES ($1, $2, $3, $4) ON CONFLICT (game, position_a, position_b) DO UPDATE SET closed = $4",
            game,
            self.position_a,
            self.position_b,
            self.closed,
        ).execute(conn).await?;
        Ok(())
    }
}
