use super::Suit;
use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "commitment")]
pub struct Commitment {
    warrior: i16,
    craft_suit: Option<Suit>
}

impl Commitment {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, "SELECT warrior, craft_suit FROM commitments WHERE game = $1", game).fetch_all(conn).await
    }
}
