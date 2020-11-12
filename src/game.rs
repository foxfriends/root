use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Game {}

impl Game {
    pub fn create(config: ()) -> Self {
        todo!()
    }
}
