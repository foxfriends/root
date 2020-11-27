use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "placed_token")]
pub struct PlacedToken {
    token: i16,
    position: i16,
}

impl PlacedToken {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(
            Self,
            "SELECT token, position FROM placed_tokens WHERE game = $1",
            game
        )
        .fetch_all(conn)
        .await
    }
}
