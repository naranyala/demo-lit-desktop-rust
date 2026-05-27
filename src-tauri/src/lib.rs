// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod stdlib;

use stdlib::error::{AppError, AppResult};

#[tauri::command]
fn greet(name: &str) -> AppResult<String> {
    if name.trim().is_empty() {
        return Err(AppError::invalid_input("Name cannot be empty"));
    }
    Ok(format!("Hello, {}! You've been greeted from Rust!", name))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_greet_valid_name() {
        let result = greet("Alice").unwrap();
        assert_eq!(result, "Hello, Alice! You've been greeted from Rust!");
    }

    #[test]
    fn test_greet_with_spaces() {
        let result = greet("John Doe").unwrap();
        assert_eq!(result, "Hello, John Doe! You've been greeted from Rust!");
    }

    #[test]
    fn test_greet_special_chars() {
        let result = greet("José").unwrap();
        assert_eq!(result, "Hello, José! You've been greeted from Rust!");
    }

    #[test]
    fn test_greet_unicode() {
        let result = greet("世界").unwrap();
        assert_eq!(result, "Hello, 世界! You've been greeted from Rust!");
    }

    #[test]
    fn test_greet_empty_name_returns_error() {
        let err = greet("").unwrap_err();
        assert!(matches!(err, AppError::InvalidInput(_)));
        assert_eq!(format!("{}", err), "Invalid input: Name cannot be empty");
    }

    #[test]
    fn test_greet_whitespace_name_returns_error() {
        let err = greet("   ").unwrap_err();
        assert!(matches!(err, AppError::InvalidInput(_)));
        assert_eq!(format!("{}", err), "Invalid input: Name cannot be empty");
    }

    #[test]
    fn test_greet_tabs_and_newlines() {
        let err = greet("\t\n\r").unwrap_err();
        assert!(matches!(err, AppError::InvalidInput(_)));
    }

    #[test]
    fn test_greet_serialized_error() {
        let err = greet("").unwrap_err();
        let json = serde_json::to_value(&err).unwrap();
        assert_eq!(json["type"], "InvalidInput");
        assert_eq!(json["message"], "Name cannot be empty");
    }

    #[test]
    fn test_greet_long_name() {
        let long_name = "A".repeat(1000);
        let result = greet(&long_name).unwrap();
        assert_eq!(result, format!("Hello, {}! You've been greeted from Rust!", long_name));
    }

    #[test]
    fn test_greet_numeric_name() {
        let result = greet("123").unwrap();
        assert_eq!(result, "Hello, 123! You've been greeted from Rust!");
    }
}
