#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize, sqlx::Type)]
#[serde(rename = "minister", rename_all = "snake_case")]
#[sqlx(rename = "enum_minister", rename_all = "snake_case")]
pub enum MinisterId {
    Foremole,
    Captain,
    Marshal,
    Banker,
    Brigadier,
    Mayor,
    EarlOfStone,
    BaronOfDirt,
    DuchessOfMud,
}
