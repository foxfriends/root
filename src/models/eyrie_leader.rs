#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize, sqlx::Type)]
#[serde(rename = "leader", rename_all = "snake_case")]
#[sqlx(rename = "enum_eyrie_leader", rename_all = "snake_case")]
pub enum EyrieLeader {
    Builder,
    Charismatic,
    Commander,
    Despot,
}
