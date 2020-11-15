use super::{CommandError, Message, Response, Status};
use uuid::Uuid;

#[derive(Debug, serde::Deserialize)]
pub struct Packet {
    id: Uuid,
    msg: Message,
}

impl Packet {
    pub fn message(&self) -> &Message {
        &self.msg
    }

    pub fn respond_ok(&self, value: serde_json::Value) -> Response {
        Response::new(self.id, Status::Ok, value, None)
    }

    pub fn respond_err(&self, error: CommandError) -> Response {
        Response::new(self.id, Status::Err, serde_json::Value::Null, Some(error))
    }
}
