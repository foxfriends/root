use super::{CommandError, SocketState};
use log::warn;
use lumber::{Question, Value};
use std::convert::TryFrom;
use std::sync::Arc;
use tokio::sync::RwLock;

mod message;
pub use message::Message;
mod runtime;
use runtime::LUMBER;

