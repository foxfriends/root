#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize)]
pub enum Assignment {
    Random,
    Choose,
}
