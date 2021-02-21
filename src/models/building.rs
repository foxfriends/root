use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "building")]
pub struct Building {
    id: i16,
    building: BuildingId,
    faction: FactionId,
    suit: Option<Suit>,
}

impl Building {
    pub fn new(id: i16, building: BuildingId, suit: Option<Suit>) -> Self {
        Self {
            id,
            building,
            faction: building.faction(),
            suit,
        }
    }
}

#[async_trait]
impl Loadable for Vec<Building> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            Building,
            r#"SELECT id, building as "building: _", faction as "faction: _", suit as "suit: _" FROM buildings WHERE game = $1"#,
            game
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Saveable for Building {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            r#"INSERT INTO buildings (game, id, building, suit) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING"#,
            game,
            self.id,
            self.building as BuildingId,
            self.suit as Option<Suit>,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}

#[async_trait]
impl Deletable for Building {
    async fn delete(game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!("DELETE FROM buildings WHERE game = $1", game)
            .execute(conn)
            .await?;
        Ok(())
    }
}
