// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod stdlib;
mod db;

use stdlib::error::{AppError, AppResult};
use tauri::menu::{Menu, MenuItem, Submenu};
use tauri::{Manager, State};
use sqlx::SqlitePool;
use crate::db::{Item};

#[tauri::command]
fn greet(name: &str) -> AppResult<String> {
    if name.trim().is_empty() {
        return Err(AppError::invalid_input("Name cannot be empty"));
    }
    Ok(format!("Hello, {}! You've been greeted from Rust!", name))
}

#[tauri::command]
async fn get_items(state: State<'_, SqlitePool>) -> AppResult<Vec<Item>> {
    db::list_items(&state).await
}

#[tauri::command]
async fn create_item(state: State<'_, SqlitePool>, name: String, description: String) -> AppResult<i64> {
    db::create_item(&state, &name, &description).await
}

#[tauri::command]
async fn update_item(state: State<'_, SqlitePool>, id: i64, name: String, description: String) -> AppResult<()> {
    db::update_item(&state, id, &name, &description).await
}

#[tauri::command]
async fn delete_item(state: State<'_, SqlitePool>, id: i64) -> AppResult<()> {
    db::delete_item(&state, id).await
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let pool = tauri::async_runtime::block_on(async {
                let pool = SqlitePool::connect("sqlite:demo.db").await
                    .expect("Failed to connect to sqlite");
                db::init_db(&pool).await.expect("Failed to init db");
                pool
            });
            app.manage(pool);

            let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let file_menu = Submenu::with_items(app, "File", true, & [
                &quit,
            ])?;

            let reload = MenuItem::with_id(app, "reload", "Reload", true, None::<&str>)?;
            let view_menu = Submenu::with_items(app, "View", true, & [
                &reload,
            ])?;

            let menu = Menu::with_items(app, &[
                &file_menu,
                &view_menu,
            ])?;

            app.set_menu(menu)?;

            Ok(())
        })
        .on_menu_event(|app, event| {
            match event.id.as_ref() {
                "quit" => {
                    app.exit(0);
                }
                "reload" => {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.reload();
                    }
                }
                _ => {}
            }
        })
        .invoke_handler(tauri::generate_handler![greet, get_items, create_item, update_item, delete_item])
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
        assert_eq!(result, format!("Hello, {}! You've been greeted from Rust!", "123"));
    }
}
