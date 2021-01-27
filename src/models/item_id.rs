#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize, sqlx::Type)]
#[serde(rename = "item", rename_all = "snake_case")]
#[sqlx(type_name = "enum_item", rename_all = "snake_case")]
pub enum ItemId {
    Hammer,
    Tea,
    Dagger,
    Bag,
    Crossbow,
    Torch,
    Boot,
    Coin,
}
