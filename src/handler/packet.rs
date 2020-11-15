use super::Message;
use uuid::Uuid;

#[derive(Debug, serde::Deserialize)]
pub struct Packet {
    pub id: Uuid,
    pub msg: Message,
}
