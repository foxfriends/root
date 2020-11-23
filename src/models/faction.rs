#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename = "faction")]
#[serde(rename_all = "snake_case")]
pub enum Faction {
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
