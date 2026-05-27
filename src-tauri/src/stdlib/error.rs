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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_internal_error_creation() {
        let err = AppError::Internal("server panic".into());
        assert!(matches!(err, AppError::Internal(_)));
    }

    #[test]
    fn test_invalid_input_error_creation() {
        let err = AppError::InvalidInput("bad data".into());
        assert!(matches!(err, AppError::InvalidInput(_)));
    }

    #[test]
    fn test_not_found_error_creation() {
        let err = AppError::NotFound("missing resource".into());
        assert!(matches!(err, AppError::NotFound(_)));
    }

    #[test]
    fn test_forbidden_error_creation() {
        let err = AppError::Forbidden("no access".into());
        assert!(matches!(err, AppError::Forbidden(_)));
    }

    #[test]
    fn test_external_error_creation() {
        let err = AppError::External("upstream timeout".into());
        assert!(matches!(err, AppError::External(_)));
    }

    #[test]
    fn test_database_error_creation() {
        let err = AppError::Database("connection failed".into());
        assert!(matches!(err, AppError::Database(_)));
    }

    #[test]
    fn test_display_internal() {
        let err = AppError::Internal("something broke".into());
        assert_eq!(format!("{}", err), "Internal server error: something broke");
    }

    #[test]
    fn test_display_invalid_input() {
        let err = AppError::InvalidInput("name is required".into());
        assert_eq!(format!("{}", err), "Invalid input: name is required");
    }

    #[test]
    fn test_display_not_found() {
        let err = AppError::NotFound("user 42".into());
        assert_eq!(format!("{}", err), "Resource not found: user 42");
    }

    #[test]
    fn test_display_forbidden() {
        let err = AppError::Forbidden("insufficient role".into());
        assert_eq!(format!("{}", err), "Permission denied: insufficient role");
    }

    #[test]
    fn test_display_external() {
        let err = AppError::External("payment gateway error".into());
        assert_eq!(format!("{}", err), "External service error: payment gateway error");
    }

    #[test]
    fn test_display_database() {
        let err = AppError::Database("deadlock detected".into());
        assert_eq!(format!("{}", err), "Database error: deadlock detected");
    }

    #[test]
    fn test_serialize_tagged_json() {
        let err = AppError::InvalidInput("too short".into());
        let json = serde_json::to_value(&err).unwrap();
        assert_eq!(json["type"], "InvalidInput");
        assert_eq!(json["message"], "too short");
    }

    #[test]
    fn test_serialize_internal_json() {
        let err = AppError::Internal("critical".into());
        let json = serde_json::to_value(&err).unwrap();
        assert_eq!(json["type"], "Internal");
        assert_eq!(json["message"], "critical");
    }

    #[test]
    fn test_helper_internal() {
        let err = AppError::internal("wrapped");
        assert!(matches!(err, AppError::Internal(_)));
        assert_eq!(format!("{}", err), "Internal server error: wrapped");
    }

    #[test]
    fn test_helper_invalid_input() {
        let err = AppError::invalid_input("wrapped");
        assert!(matches!(err, AppError::InvalidInput(_)));
        assert_eq!(format!("{}", err), "Invalid input: wrapped");
    }

    #[test]
    fn test_helper_not_found() {
        let err = AppError::not_found("wrapped");
        assert!(matches!(err, AppError::NotFound(_)));
        assert_eq!(format!("{}", err), "Resource not found: wrapped");
    }

    #[test]
    fn test_app_result_ok() {
        let result: AppResult<i32> = Ok(42);
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), 42);
    }

    #[test]
    fn test_app_result_err() {
        let result: AppResult<i32> = Err(AppError::internal("fail"));
        assert!(result.is_err());
        assert_eq!(format!("{}", result.unwrap_err()), "Internal server error: fail");
    }

    #[test]
    fn test_helper_accepts_string_slice() {
        let err = AppError::invalid_input("&str input");
        assert!(matches!(err, AppError::InvalidInput(_)));
    }

    #[test]
    fn test_helper_accepts_string() {
        let err = AppError::internal(String::from("String input"));
        assert!(matches!(err, AppError::Internal(_)));
    }
}
