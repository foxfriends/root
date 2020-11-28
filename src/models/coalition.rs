use super::FactionId;
use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "coalition")]
pub struct Coalition {
    vagabond: FactionId,
    faction: FactionId,
}

impl Coalition {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(
            Self,
            r#"SELECT vagabond as "vagabond: _", faction as "faction: _" FROM coalition WHERE game = $1"#,
            game
        )
        .fetch_all(conn)
        .await
    }
}
