use super::Suit;
use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "clearing")]
pub struct Clearing {
    position: i16,
    suit: Suit,
    slots: i16,
}

impl Clearing {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, "SELECT position, suit, slots FROM clearings WHERE game = $1", game).fetch_all(conn).await
    }
}
