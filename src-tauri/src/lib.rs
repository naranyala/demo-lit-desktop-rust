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
