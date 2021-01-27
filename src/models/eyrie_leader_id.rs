#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize, sqlx::Type)]
#[serde(rename = "leader", rename_all = "snake_case")]
#[sqlx(type_name = "enum_eyrie_leader", rename_all = "snake_case")]
pub enum EyrieLeaderId {
    Builder,
    Charismatic,
    Commander,
    Despot,
}

impl EyrieLeaderId {
    pub fn all() -> impl Iterator<Item = EyrieLeaderId> {
        [
            Self::Builder,
            Self::Charismatic,
            Self::Commander,
            Self::Despot,
        ]
        .iter()
        .copied()
    }
}
