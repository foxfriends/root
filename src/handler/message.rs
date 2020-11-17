/// A message that can be sent between sockets
#[derive(Clone, Copy)]
pub enum Message {
    /// The socket should send an updated state and set of actions to the client
    Update,
}
