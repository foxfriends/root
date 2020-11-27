use super::FactionId;
use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "duchy")]
pub struct Duchy {
    faction: FactionId,
    lord_crown: i16,
    noble_crown: i16,
    squire_crown: i16,
}

impl Duchy {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Option<Self>> {
        query_as!(Self, r#"SELECT faction as "faction: _", lord_crown, noble_crown, squire_crown FROM duchy WHERE game = $1"#, game).fetch_optional(conn).await
    }
}
