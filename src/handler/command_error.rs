#[derive(Debug, serde::Serialize)]
#[serde(rename = "kebab-case")]
enum CommandErrorCode {
    UnexpectedCommand,
    SetName,
    JoinGame,
    CreateGame,
}

#[derive(Debug, serde::Serialize)]
pub struct CommandError {
    code: CommandErrorCode,
    message: String,
}

impl CommandError {
    pub fn message(&self) -> &str {
        self.message.as_str()
    }

    pub fn unexpected() -> Self {
        Self {
            code: CommandErrorCode::UnexpectedCommand,
            message: "unexpected command".into(),
        }
    }

    pub fn set_name(message: String) -> Self {
        Self {
            code: CommandErrorCode::SetName,
            message,
        }
    }

    pub fn join_game(message: String) -> Self {
        Self {
            code: CommandErrorCode::JoinGame,
            message,
        }
    }

    pub fn create_game(message: String) -> Self {
        Self {
            code: CommandErrorCode::CreateGame,
            message,
        }
    }
}
