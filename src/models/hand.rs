use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "hand")]
pub struct Hand {
    pub card: i16,
    pub faction: FactionId,
}

#[async_trait]
impl Loadable for Vec<Hand> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            Hand,
            r#"SELECT card, faction as "faction: _" FROM hand WHERE game = $1"#,
            game
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Saveable for Hand {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO hand (game, card, faction) VALUES ($1, $2, $3) ON CONFLICT (game, card) DO UPDATE SET faction = $3",
            game,
            self.card,
            self.faction as FactionId,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}

#[async_trait]
impl Deletable for Hand {
    async fn delete(game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!("DELETE FROM hand WHERE game = $1", game)
            .execute(conn)
            .await?;
        Ok(())
    }
}
