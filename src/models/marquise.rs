#![allow(clippy::new_without_default)]

use super::FactionId;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "marquise")]
pub struct Marquise {
    faction: FactionId,
}

impl Marquise {
    pub fn new() -> Self {
        Self {
            faction: FactionId::Marquise,
        }
    }

    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Option<Self>> {
        query_as!(
            Self,
            r#"SELECT faction as "faction: _" FROM marquise WHERE game = $1"#,
            game
        )
        .fetch_optional(conn)
        .await
    }

    pub async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            r#"INSERT INTO marquise (game) VALUES ($1) ON CONFLICT DO NOTHING"#,
            game,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
