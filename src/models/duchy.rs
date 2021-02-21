#![allow(clippy::new_without_default)]
use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "duchy")]
pub struct Duchy {
    faction: FactionId,
    lord_crown: i16,
    noble_crown: i16,
    squire_crown: i16,
}

impl Duchy {
    pub fn new() -> Self {
        Self {
            faction: FactionId::Duchy,
            lord_crown: 3,
            noble_crown: 3,
            squire_crown: 3,
        }
    }
}

#[async_trait]
impl Loadable for Option<Duchy> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(Duchy, r#"SELECT faction as "faction: _", lord_crown, noble_crown, squire_crown FROM duchy WHERE game = $1"#, game).fetch_optional(conn).await
    }
}

#[async_trait]
impl Overwritable for Duchy {
    async fn overwrite(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(r#"
            INSERT INTO duchy (game, lord_crown, noble_crown, squire_crown) VALUES ($1, $2, $3, $4)
                ON CONFLICT (game) DO UPDATE SET lord_crown = $2, noble_crown = $3, squire_crown = $4
            "#,
            game,
            self.lord_crown,
            self.noble_crown,
            self.squire_crown,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
