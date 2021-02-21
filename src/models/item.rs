use super::*;
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "item")]
pub struct Item {
    id: i16,
    item: ItemId,
}

impl Item {
    pub fn new(id: i16, item: ItemId) -> Self {
        Self { id, item }
    }

    pub fn id(&self) -> i16 {
        self.id
    }
}

#[async_trait]
impl Loadable for Vec<Item> {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self> {
        query_as!(
            Item,
            r#"SELECT id, item as "item: _" FROM items WHERE game = $1"#,
            game
        )
        .fetch_all(conn)
        .await
    }
}

#[async_trait]
impl Overwritable for Item {
    async fn overwrite(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            r#"INSERT INTO items (game, id, item) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING"#,
            game,
            self.id,
            self.item as ItemId,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
