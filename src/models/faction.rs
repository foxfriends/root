#[derive(Copy, Clone, Eq, PartialEq, Debug, serde::Serialize, serde::Deserialize)]
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
    MechanicalMarquise,
}
