#![allow(clippy::new_without_default)]
use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "eyrie")]
pub struct Eyrie {
    faction: FactionId,
}

impl Eyrie {
    pub fn new() -> Self {
        Self {
            faction: FactionId::Eyrie,
        }
    }
}

#[async_trait]
impl Loadable for Option<Eyrie> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            Eyrie,
            r#"SELECT faction as "faction: _" FROM eyrie WHERE game = $1"#,
            game
        )
        .fetch_optional(conn)
        .await
    }
}

#[async_trait]
impl Overwritable for Eyrie {
    async fn overwrite(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            r#"INSERT INTO eyrie (game) VALUES ($1) ON CONFLICT DO NOTHING"#,
            game,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
