#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize, sqlx::Type)]
#[serde(rename = "building", rename_all = "snake_case")]
#[sqlx(rename = "enum_building", rename_all = "snake_case")]
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
