use super::{MinisterId, MinisterRank};
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

    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, r#"SELECT minister as "minister: _", rank as "rank: _", swayed FROM ministers WHERE game = $1"#, game).fetch_all(conn).await
    }

    pub async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            r#"INSERT INTO ministers (game, minister, swayed) VALUES ($1, $2, $3) ON CONFLICT (game, minister) DO UPDATE SET swayed = $3"#,
            game,
            self.minister as MinisterId,
            self.swayed,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
