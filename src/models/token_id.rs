#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize, sqlx::Type)]
#[serde(rename = "token", rename_all = "snake_case")]
#[sqlx(rename = "enum_token", rename_all = "snake_case")]
pub enum TokenId {
    Sympathy,
    Wood,
    Keep,
    TradePost,
    Bomb,
    Snare,
    Extortion,
    Raid,
    Tunnel,
}
