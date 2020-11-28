use super::{FactionId, Suit, TokenId};
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "token")]
pub struct Token {
    id: i16,
    token: TokenId,
    faction: FactionId,
    suit: Option<Suit>,
}

impl Token {
    pub fn new(id: i16, token: TokenId, suit: Option<Suit>) -> Self {
        Self {
            id,
            token,
            faction: token.faction(),
            suit,
        }
    }

    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, r#"SELECT id, token as "token: _", faction as "faction: _", suit as "suit: _" FROM tokens WHERE game = $1"#, game).fetch_all(conn).await
    }

    pub async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            r#"INSERT INTO tokens (game, id, token, suit) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING"#,
            game,
            self.id,
            self.token as TokenId,
            self.suit as Option<Suit>,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
