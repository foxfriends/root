use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "minister")]
pub struct Minister {
    minister: MinisterId,
    rank: MinisterRank,
    swayed: bool,
}

impl Minister {
    pub fn new(minister: MinisterId) -> Self {
        Self {
            minister,
            rank: minister.rank(),
            swayed: false,
        }
    }
}

#[async_trait]
impl Loadable for Vec<Minister> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            Minister,
            r#"SELECT minister as "minister: _", rank as "rank: _", swayed FROM ministers WHERE game = $1"#,
            game,
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Saveable for Minister {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO ministers (game, minister, swayed) VALUES ($1, $2, $3) ON CONFLICT (game, minister) DO UPDATE SET swayed = $3",
            game,
            self.minister as MinisterId,
            self.swayed,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}

#[async_trait]
impl Deletable for Minister {
    async fn delete(game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!("DELETE FROM ministers WHERE game = $1", game)
            .execute(conn)
            .await?;
        Ok(())
    }
}
