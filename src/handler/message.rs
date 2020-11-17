/// A message that can be sent between sockets
pub enum Message {
    /// The socket should send an updated state and set of actions to the client
    Update,
}
