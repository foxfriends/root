#![allow(clippy::new_without_default)]
use super::*;
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
}

#[async_trait]
impl Loadable for Option<Marquise> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            Marquise,
            r#"SELECT faction as "faction: _" FROM marquise WHERE game = $1"#,
            game
        )
        .fetch_optional(conn)
        .await
    }
}

#[async_trait]
impl Overwritable for Marquise {
    async fn overwrite(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            r#"INSERT INTO marquise (game) VALUES ($1) ON CONFLICT DO NOTHING"#,
            game,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
