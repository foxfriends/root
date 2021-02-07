use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "built_building")]
pub struct BuiltBuilding {
    building: i16,
    position: i16,
}

#[async_trait]
impl Loadable for Vec<BuiltBuilding> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            BuiltBuilding,
            "SELECT building, position FROM built_buildings WHERE game = $1",
            game
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Saveable for BuiltBuilding {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO built_buildings (game, building, position) VALUES ($1, $2, $3) ON CONFLICT (game, building) DO UPDATE SET building = $3",
            game,
            self.building,
            self.position,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
