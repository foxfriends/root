use super::FactionId;

#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize, sqlx::Type)]
#[serde(rename = "token", rename_all = "snake_case")]
#[sqlx(type_name = "enum_token", rename_all = "snake_case")]
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

impl TokenId {
    pub fn faction(self) -> FactionId {
        match self {
            Self::Sympathy => FactionId::Alliance,
            Self::Keep | Self::Wood => FactionId::Marquise,
            Self::TradePost => FactionId::Riverfolk,
            Self::Bomb | Self::Snare | Self::Extortion | Self::Raid => FactionId::Conspiracy,
            Self::Tunnel => FactionId::Duchy,
        }
    }
}
