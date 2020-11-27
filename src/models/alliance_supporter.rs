use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "alliance_supporter")]
pub struct AllianceSupporter {
    card: i16,
}

impl AllianceSupporter {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(
            Self,
            "SELECT card FROM alliance_supporters WHERE game = $1",
            game
        )
        .fetch_all(conn)
        .await
    }
}
