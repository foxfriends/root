#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize, sqlx::Type)]
#[serde(rename = "assignment", rename_all = "snake_case")]
#[sqlx(rename = "enum_assignment", rename_all = "snake_case")]
pub enum Assignment {
    Random,
    Choose,
}

impl Default for Assignment {
    fn default() -> Self {
        Self::Random
    }
}
