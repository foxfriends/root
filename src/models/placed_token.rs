use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "placed_token")]
pub struct PlacedToken {
    token: i16,
    position: i16,
}

#[async_trait]
impl Loadable for Vec<PlacedToken> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            PlacedToken,
            "SELECT token, position FROM placed_tokens WHERE game = $1",
            game
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Saveable for PlacedToken {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO placed_tokens (game, token, position) VALUES ($1, $2, $3) ON CONFLICT (game, token) DO UPDATE SET position = $3",
            game,
            self.token,
            self.position,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}

#[async_trait]
impl Deletable for PlacedToken {
    async fn delete(game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!("DELETE FROM placed_tokens WHERE game = $1", game)
            .execute(conn)
            .await?;
        Ok(())
    }
}
