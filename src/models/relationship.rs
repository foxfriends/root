#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize, sqlx::Type)]
#[serde(rename = "relationship", rename_all = "snake_case")]
#[sqlx(rename = "enum_relationship", rename_all = "snake_case")]
pub enum Relationship {
    Hostile,
    Indifferent,
    Distant,
    Close,
    Allied,
}

impl Default for Relationship {
    fn default() -> Self {
        Self::Indifferent
    }
}
