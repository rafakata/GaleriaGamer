const Database = require('better-sqlite3');
const path = require('path');

// Crea el archivo db.sqlite en la carpeta data
const dbPath = path.resolve(__dirname, 'db.sqlite');
const db = new Database(dbPath, { verbose: console.log });

module.exports = db;