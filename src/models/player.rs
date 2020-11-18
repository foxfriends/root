#[derive(Clone, serde::Serialize, serde::Deserialize)]
pub struct Player {
    name: String,
    ready: bool,
}

impl Player {
    pub fn new(name: String) -> Self {
        Self { name, ready: false }
    }

    pub fn name(&self) -> &str {
        self.name.as_str()
    }
}
