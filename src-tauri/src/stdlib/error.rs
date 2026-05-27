use serde::Serialize;
use thiserror::Error;

#[derive(Debug, Error, Serialize)]
#[serde(tag = "type", content = "message")]
pub enum AppError {
    #[error("Internal server error: {0}")]
    Internal(String),
    #[error("Invalid input: {0}")]
    InvalidInput(String),
    #[error("Resource not found: {0}")]
    NotFound(String),
    #[error("Permission denied: {0}")]
    Forbidden(String),
    #[error("External service error: {0}")]
    External(String),
    #[error("Database error: {0}")]
    Database(String),
}

pub type AppResult<T> = Result<T, AppError>;

impl AppError {
    pub fn internal(msg: impl Into<String>) -> Self {
        Self::Internal(msg.into())
    }
    pub fn invalid_input(msg: impl Into<String>) -> Self {
        Self::InvalidInput(msg.into())
    }
    pub fn not_found(msg: impl Into<String>) -> Self {
        Self::NotFound(msg.into())
    }
}
