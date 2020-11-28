use super::FactionId;
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

    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Option<Self>> {
        query_as!(Self, r#"SELECT faction as "faction: _", hand_card, riverboats, mercenaries FROM riverfolk WHERE game = $1"#, game).fetch_optional(conn).await
    }

    pub async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
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
