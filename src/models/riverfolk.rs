#![allow(clippy::new_without_default)]
use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "riverfolk")]
pub struct Riverfolk {
    faction: FactionId,
    hand_card: i16,
    riverboats: i16,
    mercenaries: i16,
}

impl Riverfolk {
    pub fn new() -> Self {
        Self {
            faction: FactionId::Riverfolk,
            hand_card: 1,
            riverboats: 1,
            mercenaries: 1,
        }
    }
}

#[async_trait]
impl Loadable for Option<Riverfolk> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            Riverfolk,
            r#"SELECT faction as "faction: _", hand_card, riverboats, mercenaries FROM riverfolk WHERE game = $1"#,
            game,
        )
        .fetch_optional(conn)
        .await
    }
}

#[async_trait]
impl Saveable for Riverfolk {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            r#"
            INSERT INTO riverfolk (game, hand_card, riverboats, mercenaries) VALUES ($1, $2, $3, $4)
                ON CONFLICT (game) DO UPDATE SET hand_card = $2, riverboats = $3, mercenaries = $4
            "#,
            game,
            self.hand_card,
            self.riverboats,
            self.mercenaries,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
