use super::{ClientCommand, Socket, Status};
use serde_json::{json, Value};
use uuid::Uuid;

#[derive(Debug, serde::Deserialize)]
pub struct Packet {
    id: Uuid,
    msg: ClientCommand,
}

impl Packet {
    pub fn command(&self) -> &ClientCommand {
        &self.msg
    }

    pub async fn execute(self, socket: &Socket) -> Value {
        match self.msg.execute(socket).await {
            Ok(()) => json!({ "id": self.id, "status": Status::Ok }),
            Err(error) => json!({ "id": self.id, "status": Status::Err, "error": error }),
        }
    }
}
