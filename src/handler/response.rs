use super::{CommandError, Status};
use std::fmt::{self, Display, Formatter};
use uuid::Uuid;

#[derive(serde::Serialize)]
pub struct Response {
    id: Uuid,
    status: Status,
    data: serde_json::Value,
    error: Option<CommandError>,
}

impl Response {
    pub fn new(
        id: Uuid,
        status: Status,
        data: serde_json::Value,
        error: Option<CommandError>,
    ) -> Self {
        Self {
            id,
            status,
            error,
            data,
        }
    }
}

impl Display for Response {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        serde_json::to_string(self).unwrap().fmt(f)
    }
}
