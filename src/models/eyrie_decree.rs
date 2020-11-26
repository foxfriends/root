use super::Action;
use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "eyrie_decree")]
pub struct EyrieDecree {
    card: i16,
    id: i16,
    action: Action,
}

impl EyrieDecree {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, "SELECT card, id, action FROM eyrie_decree WHERE game = $1", game).fetch_all(conn).await
    }
}
