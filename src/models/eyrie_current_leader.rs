use super::EyrieLeaderId;
use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "eyrie_current_leader")]
pub struct EyrieCurrentLeader {
    leader: Option<EyrieLeaderId>,
}

impl EyrieCurrentLeader {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Option<Self>> {
        query_as!(
            Self,
            r#"SELECT leader as "leader: _" FROM eyrie_current_leader WHERE game = $1"#,
            game
        )
        .fetch_optional(conn)
        .await
    }
}
