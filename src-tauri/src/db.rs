use sqlx::{sqlite::SqlitePool, Row};
use serde::{Serialize, Deserialize};
use crate::stdlib::error::{AppError, AppResult};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Item {
    pub id: i64,
    pub name: String,
    pub description: String,
}

pub async fn init_db(pool: &SqlitePool) -> AppResult<()> {
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT NOT NULL
        )"
    )
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;
    
    Ok(())
}

pub async fn list_items(pool: &SqlitePool) -> AppResult<Vec<Item>> {
    let rows = sqlx::query_as!(Item, "SELECT id, name, description FROM items")
        .fetch_all(pool)
        .await
        .map_err(|e| AppError::Database(e.to_string()))?;
    Ok(rows)
}

pub async fn create_item(pool: &SqlitePool, name: &str, description: &str) -> AppResult<i64> {
    let id = sqlx::query!("INSERT INTO items (name, description) VALUES (?, ?)", name, description)
        .execute(pool)
        .await
        .map_err(|e| AppError::Database(e.to_string()))?
        .last_insert_rowid();
    Ok(id)
}

pub async fn update_item(pool: &SqlitePool, id: i64, name: &str, description: &str) -> AppResult<()> {
    sqlx::query!("UPDATE items SET name = ?, description = ? WHERE id = ?", name, description, id)
        .execute(pool)
        .await
        .map_err(|e| AppError::Database(e.to_string()))?;
    Ok(())
}

pub async fn delete_item(pool: &SqlitePool, id: i64) -> AppResult<()> {
    sqlx::query!("DELETE FROM items WHERE id = ?", id)
        .execute(pool)
        .await
        .map_err(|e| AppError::Database(e.to_string()))?;
    Ok(())
}
