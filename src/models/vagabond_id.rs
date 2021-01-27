#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize, sqlx::Type)]
#[serde(rename = "vagabond", rename_all = "snake_case")]
#[sqlx(type_name = "enum_vagabond", rename_all = "snake_case")]
pub enum VagabondId {
    Thief,
    Ranger,
    Tinker,
    Vagrant,
    Arbiter,
    Scoundrel,
    Adventurer,
    Ronin,
    Harrier,
}
