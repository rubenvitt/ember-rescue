use tauri_plugin_sql::{Migration, MigrationKind};

pub fn migrations() -> Vec<Migration> {
    println!("Hello from src-tauri/database.rs");
    return vec![
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL); INSERT INTO users (name) VALUES ('Alice'); INSERT INTO users (name) VALUES ('Bob');",
            kind: MigrationKind::Up,
        }
    ];
}