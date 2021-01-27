use super::FactionId;

#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize, sqlx::Type)]
#[serde(rename = "building", rename_all = "snake_case")]
#[sqlx(type_name = "enum_building", rename_all = "snake_case")]
pub enum BuildingId {
    Base,
    Roost,
    Sawmill,
    Workshop,
    Recruiter,
    Garden,
    Citadel,
    Market,
}

impl BuildingId {
    pub fn faction(self) -> FactionId {
        match self {
            Self::Base => FactionId::Alliance,
            Self::Roost => FactionId::Eyrie,
            Self::Sawmill | Self::Workshop | Self::Recruiter => FactionId::Marquise,
            Self::Garden => FactionId::Cult,
            Self::Citadel | Self::Market => FactionId::Duchy,
        }
    }
}
