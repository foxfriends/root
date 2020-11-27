#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize, sqlx::Type)]
#[serde(rename = "rank", rename_all = "snake_case")]
#[sqlx(rename = "enum_minister_rank", rename_all = "snake_case")]
pub enum MinisterRank {
    Squire,
    Noble,
    Lord,
}
