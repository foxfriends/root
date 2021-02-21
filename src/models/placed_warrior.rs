use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "placed_warrior")]
pub struct PlacedWarrior {
    warrior: i16,
    position: i16,
}

#[async_trait]
impl Loadable for Vec<PlacedWarrior> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            PlacedWarrior,
            "SELECT warrior, position FROM placed_warriors WHERE game = $1",
            game
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Saveable for PlacedWarrior {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO placed_warriors (game, warrior, position) VALUES ($1, $2, $3) ON CONFLICT (game, warrior) DO UPDATE SET position = $3",
            game,
            self.warrior,
            self.position,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}

#[async_trait]
impl Deletable for PlacedWarrior {
    async fn delete(game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!("DELETE FROM placed_warriors WHERE game = $1", game)
            .execute(conn)
            .await?;
        Ok(())
    }
}
