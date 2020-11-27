use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "river")]
pub struct River {
    position_a: i16,
    position_b: i16,
}

impl River {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(
            Self,
            "SELECT position_a, position_b FROM rivers WHERE game = $1",
            game
        )
        .fetch_all(conn)
        .await
    }
}
