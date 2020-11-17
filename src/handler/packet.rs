use super::{ClientCommand, Response, Socket, Status};
use serde_json::Value;
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
        let response = match self.msg.execute(socket).await {
            Ok(value) => Response::new(self.id, Status::Ok, value, None),
            Err(error) => Response::new(self.id, Status::Err, Value::Null, Some(error)),
        };
        serde_json::to_value(response).unwrap()
    }
}
