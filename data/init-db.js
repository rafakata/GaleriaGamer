const db = require('./database');

// Crear tabla usuarios (Igual que en todo-list)
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        name TEXT
    )
`).run();

// Crear tabla videojuegos (Adaptada para el Reto)
db.prepare(`
    CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        platform TEXT,
        genre TEXT,
        status TEXT,
        userId INTEGER,
        FOREIGN KEY(userId) REFERENCES users(id)
    )
`).run();

console.log('Tablas creadas correctamente.');