use super::{FactionId, VagabondId};
use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "vagabond")]
pub struct Vagabond {
    faction: FactionId,
    vagabond: VagabondId,
    position: i16,
}

impl Vagabond {
    pub async fn load(
        game: &str,
        faction: FactionId,
        conn: &mut PgConnection,
    ) -> sqlx::Result<Option<Self>> {
        query_as!(Self, r#"SELECT faction as "faction: _", vagabond as "vagabond: _", position FROM vagabond WHERE game = $1 AND faction = $2::enum_faction"#, game, faction as FactionId).fetch_optional(conn).await
    }
}
