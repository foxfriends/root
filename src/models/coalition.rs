use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "coalition")]
pub struct Coalition {
    vagabond: FactionId,
    faction: FactionId,
}

#[async_trait]
impl Loadable for Vec<Coalition> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            Coalition,
            r#"SELECT vagabond as "vagabond: _", faction as "faction: _" FROM coalition WHERE game = $1"#,
            game
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Saveable for Coalition {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO coalition (game, vagabond, faction) VALUES ($1, $2, $3) ON CONFLICT (game, vagabond) DO UPDATE SET faction = $3",
            game,
            self.vagabond as FactionId,
            self.faction as FactionId,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
