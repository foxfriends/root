use super::EyrieLeaderId;
use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "eyrie_leader")]
pub struct EyrieLeader {
    leader: EyrieLeaderId,
    used: bool,
}

impl EyrieLeader {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(
            Self,
            r#"SELECT leader as "leader: _", used FROM eyrie_leaders WHERE game = $1"#,
            game
        )
        .fetch_all(conn)
        .await
    }
}
