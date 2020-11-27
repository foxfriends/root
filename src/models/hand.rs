use super::FactionId;
use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "hand")]
pub struct Hand {
    card: i16,
    faction: FactionId,
}

impl Hand {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(
            Self,
            r#"SELECT card, faction as "faction: _" FROM hand WHERE game = $1"#,
            game
        )
        .fetch_all(conn)
        .await
    }
}
