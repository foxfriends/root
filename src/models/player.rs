use sqlx::{query_as, PgConnection};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "player")]
pub struct Player {
    name: String,
    ready: bool,
}

impl Player {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Player>> {
        query_as!(
            Self,
            "SELECT name, ready FROM players WHERE game = $1",
            game
        )
        .fetch_all(conn)
        .await
    }

    pub fn new(name: String) -> Self {
        Self { name, ready: false }
    }

    pub fn name(&self) -> &str {
        self.name.as_str()
    }
}
