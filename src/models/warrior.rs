use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "warrior")]
pub struct Warrior {
    id: i16,
    faction: FactionId,
}

impl Warrior {
    pub fn new(id: i16, faction: FactionId) -> Self {
        Self { id, faction }
    }
}

#[async_trait]
impl Loadable for Vec<Warrior> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            Warrior,
            r#"SELECT id, faction as "faction: _" FROM warriors WHERE game = $1"#,
            game
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Saveable for Warrior {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            r#"INSERT INTO warriors (game, id, faction) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING"#,
            game,
            self.id,
            self.faction as FactionId,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
