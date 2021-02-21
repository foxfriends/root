use super::*;
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
}

#[async_trait]
impl Loadable for Vec<Dominance> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            Dominance,
            r#"SELECT card, faction as "faction: _" FROM dominance WHERE game = $1"#,
            game
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Saveable for Dominance {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO dominance (game, card, faction) VALUES ($1, $2, $3) ON CONFLICT (game, card) DO UPDATE SET faction = $3",
            game,
            self.card,
            self.faction as Option<FactionId>,
        )
        .execute(conn).await?;
        Ok(())
    }
}

#[async_trait]
impl Deletable for Dominance {
    async fn delete(game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!("DELETE FROM dominance WHERE game = $1", game)
            .execute(conn)
            .await?;
        Ok(())
    }
}
