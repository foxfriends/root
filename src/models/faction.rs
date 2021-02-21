use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "faction")]
pub struct Faction {
    faction: FactionId,
    player: Option<String>,
    points: i16,
}

impl Faction {
    pub fn new(faction: FactionId) -> Self {
        Self {
            faction,
            player: None,
            points: 0,
        }
    }
}

#[async_trait]
impl Loadable for Vec<Faction> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            Faction,
            r#"SELECT faction as "faction: _", player, points FROM factions WHERE game = $1"#,
            game
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Overwritable for Faction {
    async fn overwrite(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            "INSERT INTO factions (game, faction, player, points) VALUES ($1, $2, $3, $4) ON CONFLICT (game, faction) DO UPDATE SET player = $3, points = $4",
            game,
            self.faction as FactionId,
            self.player,
            self.points,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
