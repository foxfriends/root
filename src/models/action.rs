#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize, sqlx::Type)]
#[serde(rename = "action", rename_all = "snake_case")]
#[sqlx(rename = "enum_action", rename_all = "snake_case")]
pub enum Action {
    Recruit,
    Move,
    Battle,
    Build,
}
