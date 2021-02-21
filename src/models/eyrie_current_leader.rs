#![allow(clippy::new_without_default)]
use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "eyrie_current_leader")]
pub struct EyrieCurrentLeader {
    leader: Option<EyrieLeaderId>,
}

impl EyrieCurrentLeader {
    pub fn new() -> Self {
        EyrieCurrentLeader { leader: None }
    }
}

#[async_trait]
impl Loadable for Option<EyrieCurrentLeader> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            EyrieCurrentLeader,
            r#"SELECT leader as "leader: _" FROM eyrie_current_leader WHERE game = $1"#,
            game
        )
        .fetch_optional(conn)
        .await
    }
}

#[async_trait]
impl Overwritable for EyrieCurrentLeader {
    async fn overwrite(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            r#"INSERT INTO eyrie_current_leader (game, leader) VALUES ($1, $2) ON CONFLICT (game) DO UPDATE SET leader = $2"#,
            game,
            self.leader as Option<EyrieLeaderId>,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
