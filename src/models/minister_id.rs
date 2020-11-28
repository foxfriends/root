use super::MinisterRank;

#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize, sqlx::Type)]
#[serde(rename = "minister", rename_all = "snake_case")]
#[sqlx(rename = "enum_minister", rename_all = "snake_case")]
pub enum MinisterId {
    Foremole,
    Captain,
    Marshal,
    Banker,
    Brigadier,
    Mayor,
    EarlOfStone,
    BaronOfDirt,
    DuchessOfMud,
}

impl MinisterId {
    pub fn rank(self) -> MinisterRank {
        match self {
            Self::Foremole | Self::Captain | Self::Marshal => MinisterRank::Squire,
            Self::Banker | Self::Brigadier | Self::Mayor => MinisterRank::Noble,
            Self::EarlOfStone | Self::BaronOfDirt | Self::DuchessOfMud => MinisterRank::Lord,
        }
    }

    pub fn all() -> impl Iterator<Item = Self> {
        [
            Self::Foremole,
            Self::Captain,
            Self::Marshal,
            Self::Banker,
            Self::Brigadier,
            Self::Mayor,
            Self::EarlOfStone,
            Self::BaronOfDirt,
            Self::DuchessOfMud,
        ]
        .iter()
        .copied()
    }
}
