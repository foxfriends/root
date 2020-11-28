use super::FactionId;
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

    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Option<Self>> {
        query_as!(Self, r#"SELECT faction as "faction: _", lord_crown, noble_crown, squire_crown FROM duchy WHERE game = $1"#, game).fetch_optional(conn).await
    }

    pub async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
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
