use super::FactionId;
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

    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(
            Self,
            r#"SELECT id, faction as "faction: _" FROM warriors WHERE game = $1"#,
            game
        )
        .fetch_all(conn)
        .await
    }

    pub async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
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
