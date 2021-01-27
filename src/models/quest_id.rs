#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize, sqlx::Type)]
#[serde(rename = "quest", rename_all = "snake_case")]
#[sqlx(type_name = "enum_quest", rename_all = "snake_case")]
pub enum QuestId {
    Errand,
    Escort,
    ExpelBandits,
    FendOffABear,
    Fundraising,
    GiveASpeech,
    GuardDuty,
    LogisticsHelp,
    RepairAShed,
}
