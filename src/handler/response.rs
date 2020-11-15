use super::{CommandError, Status};
use uuid::Uuid;

#[derive(serde::Serialize)]
pub struct Response {
    pub id: Uuid,
    pub status: Status,
    pub error: Option<CommandError>,
    pub data: serde_json::Value,
}
