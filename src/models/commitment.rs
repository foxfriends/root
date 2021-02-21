use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "commitment")]
pub struct Commitment {
    warrior: i16,
    craft_suit: Option<Suit>,
}

#[async_trait]
impl Loadable for Vec<Commitment> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            Commitment,
            r#"SELECT warrior, craft_suit as "craft_suit: _" FROM commitments WHERE game = $1"#,
            game
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Saveable for Commitment {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO commitments (game, warrior, craft_suit) VALUES ($1, $2, $3) ON CONFLICT (game, warrior) DO UPDATE SET craft_suit = $3",
            game,
            self.warrior,
            self.craft_suit as Option<Suit>,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}

#[async_trait]
impl Deletable for Commitment {
    async fn delete(game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!("DELETE FROM commitments WHERE game = $1", game)
            .execute(conn)
            .await?;
        Ok(())
    }
}
