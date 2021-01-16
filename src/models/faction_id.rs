#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize, sqlx::Type)]
#[serde(rename = "faction", rename_all = "snake_case")]
#[sqlx(rename = "enum_faction", rename_all = "snake_case")]
pub enum FactionId {
    Marquise,
    Eyrie,
    Alliance,
    Vagabond,
    Vagabond2,
    Cult,
    Riverfolk,
    Duchy,
    Conspiracy,
}

impl FactionId {
    pub fn setup_order() -> impl Iterator<Item = FactionId> {
        use FactionId::*;
        [
            Marquise, Eyrie, Alliance, Vagabond, Vagabond2, Cult, Riverfolk, Duchy, Conspiracy,
        ]
        .iter()
        .copied()
    }
}
