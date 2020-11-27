use super::{FactionId, Relationship};
use sqlx::{postgres::PgConnection, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "vagabond_relationship")]
pub struct VagabondRelationship {
    vagabond: FactionId,
    faction: FactionId,
    relationship: Relationship,
}

impl VagabondRelationship {
    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, r#"SELECT vagabond as "vagabond: _", faction as "faction: _", relationship as "relationship: _" FROM vagabond_relationships WHERE game = $1"#, game).fetch_all(conn).await
    }
}
