use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "eyrie_decree")]
pub struct EyrieDecree {
    card: Option<i16>,
    id: i16,
    action: Action,
}

#[async_trait]
impl Loadable for Vec<EyrieDecree> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            EyrieDecree,
            r#"SELECT card, id, action as "action: _" FROM eyrie_decree WHERE game = $1"#,
            game
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Saveable for EyrieDecree {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            r#"INSERT INTO eyrie_decree (game, card, id, action) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING"#,
            game,
            self.card as Option<i16>,
            self.id,
            self.action as Action,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
