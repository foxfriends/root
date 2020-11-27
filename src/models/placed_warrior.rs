use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "placed_warrior")]
pub struct PlacedWarrior {
    warrior: i16,
    position: i16,
}

impl PlacedWarrior {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(
            Self,
            "SELECT warrior, position FROM placed_warriors WHERE game = $1",
            game
        )
        .fetch_all(conn)
        .await
    }
}
