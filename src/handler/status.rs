#[derive(serde::Serialize)]
#[serde(rename_all = "lowercase")]
pub enum Status {
    Ok,
    Err,
}
