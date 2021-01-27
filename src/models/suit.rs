#[derive(Copy, Clone, Eq, PartialEq, serde::Serialize, serde::Deserialize, sqlx::Type)]
#[sqlx(type_name = "enum_suit", rename_all = "snake_case")]
#[serde(rename = "suit", rename_all = "snake_case")]
pub enum Suit {
    Mouse,
    Fox,
    Rabbit,
    Bird,
}
