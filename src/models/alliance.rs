#![allow(clippy::new_without_default)]
use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "alliance")]
pub struct Alliance {
    faction: FactionId,
}

impl Alliance {
    pub fn new() -> Self {
        Self {
            faction: FactionId::Alliance,
        }
    }
}

#[async_trait]
impl Loadable for Option<Alliance> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            Alliance,
            r#"SELECT faction as "faction: _" FROM alliance WHERE game = $1"#,
            game
        )
        .fetch_optional(conn)
        .await
    }
}

#[async_trait]
impl Saveable for Alliance {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO alliance (game) VALUES ($1) ON CONFLICT DO NOTHING",
            game
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
