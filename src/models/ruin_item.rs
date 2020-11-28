use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "ruin_item")]
pub struct RuinItem {
    clearing: Option<i16>,
    item: i16,
}

impl RuinItem {
    pub fn new(clearing: i16, item: i16) -> Self {
        Self {
            clearing: Some(clearing),
            item,
        }
    }

    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(
            Self,
            "SELECT clearing, item FROM ruin_items WHERE game = $1",
            game
        )
        .fetch_all(conn)
        .await
    }

    pub async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            r#"INSERT INTO ruin_items (game, clearing, item) VALUES ($1, $2, $3) ON CONFLICT (game, item) DO UPDATE SET clearing = $2"#,
            game,
            self.clearing,
            self.item,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
