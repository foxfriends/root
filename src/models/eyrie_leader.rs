use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "eyrie_leader")]
pub struct EyrieLeader {
    leader: EyrieLeaderId,
    used: bool,
}

impl EyrieLeader {
    pub fn new(leader: EyrieLeaderId) -> Self {
        Self {
            leader,
            used: false,
        }
    }
}

#[async_trait]
impl Loadable for Vec<EyrieLeader> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            EyrieLeader,
            r#"SELECT leader as "leader: _", used FROM eyrie_leaders WHERE game = $1"#,
            game
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Saveable for EyrieLeader {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            r#"INSERT INTO eyrie_leaders (game, leader, used) VALUES ($1, $2, $3) ON CONFLICT (game, leader) DO UPDATE SET used = $3"#,
            game,
            self.leader as EyrieLeaderId,
            self.used,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}

#[async_trait]
impl Deletable for EyrieLeader {
    async fn delete(game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!("DELETE FROM eyrie_leaders WHERE game = $1", game)
            .execute(conn)
            .await?;
        Ok(())
    }
}
