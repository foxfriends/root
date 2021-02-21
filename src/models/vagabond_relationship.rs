use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "vagabond_relationship")]
pub struct VagabondRelationship {
    vagabond: FactionId,
    faction: FactionId,
    relationship: Relationship,
}

impl VagabondRelationship {
    pub fn new(vagabond: &Vagabond, faction: FactionId) -> Self {
        Self {
            vagabond: vagabond.faction(),
            faction,
            relationship: Relationship::default(),
        }
    }
}

#[async_trait]
impl Loadable for Vec<VagabondRelationship> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            VagabondRelationship,
            r#"SELECT vagabond as "vagabond: _", faction as "faction: _", relationship as "relationship: _" FROM vagabond_relationships WHERE game = $1"#,
            game,
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Overwritable for VagabondRelationship {
    async fn overwrite(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            r#"INSERT INTO vagabond_relationships (game, vagabond, faction, relationship) VALUES ($1, $2, $3, $4) ON CONFLICT (game, vagabond, faction) DO UPDATE SET relationship = $4"#,
            game,
            self.vagabond as FactionId,
            self.faction as FactionId,
            self.relationship as Relationship,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
