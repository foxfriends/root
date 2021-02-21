use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "player")]
pub struct Player {
    name: String,
    ready: bool,
}

impl Player {
    pub fn new(name: String) -> Self {
        Self { name, ready: false }
    }

    pub fn name(&self) -> &str {
        self.name.as_str()
    }
}

#[async_trait]
impl Loadable for Vec<Player> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Player>> {
        query_as!(
            Player,
            "SELECT name, ready FROM players WHERE game = $1",
            game
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Overwritable for Player {
    async fn overwrite(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO players (game, name, ready) VALUES ($1, $2, $3) ON CONFLICT (game, name) DO UPDATE SET ready = $3",
            game,
            self.name,
            self.ready,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
