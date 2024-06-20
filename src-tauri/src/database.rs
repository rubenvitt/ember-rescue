use tauri_plugin_sql::{Migration, MigrationKind};

pub fn migrations() -> Vec<Migration> {
    println!("Hello from src-tauri/database.rs");
    return vec![
        Migration {
            version: 2,
            description: "create_initial_tables",
            sql: "CREATE TABLE IF NOT EXISTS users (  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, ); INSERT INTO users (name) VALUES ('Alice');",
            kind: MigrationKind::Up,
        }
    ];
}