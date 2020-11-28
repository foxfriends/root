use super::{CardId, Suit};
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "card")]
pub struct Card {
    id: i16,
    card: CardId,
    suit: Suit,
}

impl Card {
    pub fn new(id: i16, card: CardId, suit: Suit) -> Self {
        Self { id, card, suit }
    }

    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(
            Self,
            r#"SELECT id, card as "card: _", suit as "suit: _" FROM cards WHERE game = $1"#,
            game
        )
        .fetch_all(conn)
        .await
    }

    pub async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            r#"INSERT INTO cards (game, id, card, suit) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING"#,
            game,
            self.id,
            self.card as CardId,
            self.suit as Suit,
        ).execute(conn).await?;
        Ok(())
    }
}
