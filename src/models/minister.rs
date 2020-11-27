use super::{MinisterId, MinisterRank};
use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "minister")]
pub struct Minister {
    minister: MinisterId,
    rank: MinisterRank,
    swayed: bool,
}

impl Minister {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, r#"SELECT minister as "minister: _", rank as "rank: _", swayed FROM ministers WHERE game = $1"#, game).fetch_all(conn).await
    }
}
