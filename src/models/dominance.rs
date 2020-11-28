use super::FactionId;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "dominance")]
pub struct Dominance {
    card: i16,
    faction: Option<FactionId>,
}

impl Dominance {
    pub fn new(card: i16) -> Self {
        Self {
            card,
            faction: None,
        }
    }

    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(
            Self,
            r#"SELECT card, faction as "faction: _" FROM dominance WHERE game = $1"#,
            game
        )
        .fetch_all(conn)
        .await
    }

    pub async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            r#"INSERT INTO dominance (game, card, faction) VALUES ($1, $2, $3) ON CONFLICT (game, card) DO UPDATE SET faction = $3"#,
            game,
            self.card,
            self.faction as Option<FactionId>,
        )
        .execute(conn).await?;
        Ok(())
    }
}
