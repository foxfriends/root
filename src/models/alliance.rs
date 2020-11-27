use super::FactionId;
use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "alliance")]
pub struct Alliance {
    faction: FactionId,
}

impl Alliance {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Option<Self>> {
        query_as!(
            Self,
            r#"SELECT faction as "faction: _" FROM alliance WHERE game = $1"#,
            game
        )
        .fetch_optional(conn)
        .await
    }
}
