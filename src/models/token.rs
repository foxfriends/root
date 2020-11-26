use super::{TokenId, FactionId};
use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "token")]
pub struct Token {
    id: i16,
    token: TokenId,
    faction: FactionId,
}

impl Token {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, "SELECT id, token, faction FROM tokens WHERE game = $1", game).fetch_all(conn).await
    }
}
