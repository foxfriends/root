use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "acolyte")]
pub struct Acolyte {
    warrior: i16,
}

impl Acolyte {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, "SELECT warrior FROM acolytes WHERE game = $1", game)
            .fetch_all(conn)
            .await
    }
}
