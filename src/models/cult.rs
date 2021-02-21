#![allow(clippy::new_without_default)]
use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "cult")]
pub struct Cult {
    faction: FactionId,
    outcast: Option<Suit>,
    hated_outcast: bool,
}

impl Cult {
    pub fn new() -> Self {
        Self {
            faction: FactionId::Cult,
            outcast: None,
            hated_outcast: false,
        }
    }
}

#[async_trait]
impl Loadable for Option<Cult> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(Cult, r#"SELECT faction as "faction: _", outcast as "outcast: _", hated_outcast FROM cult WHERE game = $1"#, game).fetch_optional(conn).await
    }
}

#[async_trait]
impl Overwritable for Cult {
    async fn overwrite(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            r#"INSERT INTO cult (game, outcast, hated_outcast) VALUES ($1, $2, $3) ON CONFLICT (game) DO UPDATE SET outcast = $2, hated_outcast = $3"#,
            game,
            self.outcast as Option<Suit>,
            self.hated_outcast,
        ).execute(conn).await?;
        Ok(())
    }
}
