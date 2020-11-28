#![allow(clippy::new_without_default)]

use super::FactionId;
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

    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Option<Self>> {
        query_as!(
            Self,
            r#"SELECT faction as "faction: _" FROM eyrie WHERE game = $1"#,
            game
        )
        .fetch_optional(conn)
        .await
    }

    pub async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            r#"INSERT INTO eyrie (game) VALUES ($1) ON CONFLICT DO NOTHING"#,
            game,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
