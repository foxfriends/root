#[derive(Clone, serde::Serialize, serde::Deserialize)]
pub struct Player {
    name: String,
}

impl Player {
    pub fn new(name: String) -> Self {
        Self { name }
    }

    pub fn name(&self) -> &str {
        self.name.as_str()
    }
}
