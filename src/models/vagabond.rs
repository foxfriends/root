use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "vagabond")]
pub struct Vagabond {
    faction: FactionId,
    vagabond: Option<VagabondId>,
    position: Option<i16>,
}

impl Vagabond {
    pub fn new(faction: FactionId) -> Self {
        Self {
            faction,
            vagabond: None,
            position: None,
        }
    }

    pub fn faction(&self) -> FactionId {
        self.faction
    }

    pub async fn load(
        game: &str,
        faction: FactionId,
        conn: &mut PgConnection,
    ) -> sqlx::Result<Option<Self>> {
        query_as!(
            Self,
            r#"SELECT faction as "faction: _", vagabond as "vagabond: _", position FROM vagabond WHERE game = $1 AND faction = $2::enum_faction"#,
            game,
            faction as FactionId,
        )
        .fetch_optional(conn)
        .await
    }
}

#[async_trait]
impl Overwritable for Vagabond {
    async fn overwrite(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO vagabond (game, faction, vagabond, position) VALUES ($1, $2, $3, $4) ON CONFLICT (game, faction) DO UPDATE SET vagabond = $3, position = $4",
            game,
            self.faction as FactionId,
            self.vagabond as Option<VagabondId>,
            self.position,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
