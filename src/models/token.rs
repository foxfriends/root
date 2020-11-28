use super::{FactionId, TokenId};
use sqlx::{postgres::PgConnection, query, query_as};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename = "token")]
pub struct Token {
    id: i16,
    token: TokenId,
    faction: FactionId,
}

impl Token {
    pub fn new(id: i16, token: TokenId) -> Self {
        Self {
            id,
            token,
            faction: token.faction(),
        }
    }

    pub async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Vec<Self>> {
        query_as!(Self, r#"SELECT id, token as "token: _", faction as "faction: _" FROM tokens WHERE game = $1"#, game).fetch_all(conn).await
    }

    pub async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        query!(
            r#"INSERT INTO tokens (game, id, token) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING"#,
            game,
            self.id,
            self.token as TokenId,
        )
        .execute(conn)
        .await?;
        Ok(())
    }
}
