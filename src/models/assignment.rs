#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename = "assignment")]
#[serde(rename_all = "snake_case")]
pub enum Assignment {
    Random,
    Choose,
}
