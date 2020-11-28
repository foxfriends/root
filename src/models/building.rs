use super::{BuildingId, FactionId};
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "building")]
pub struct Building {
    id: i16,
    building: BuildingId,
    faction: FactionId,
}

impl Building {
    pub fn new(id: i16, building: BuildingId) -> Self {
        Self {
            id,
            building,
            faction: building.faction(),
        }
    }

    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, r#"SELECT id, building as "building: _", faction as "faction: _" FROM buildings WHERE game = $1"#, game).fetch_all(conn).await
    }

    pub async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            r#"INSERT INTO buildings (game, id, building) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING"#,
            game,
            self.id,
            self.building as BuildingId,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
