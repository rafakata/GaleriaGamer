const db = require('./database');

class GameDAO {
    // Obtener juegos de un usuario con filtros opcionales
    getAll(userId, filters = {}) {
        let query = 'SELECT * FROM games WHERE userId = ?';
        const params = [userId];

        if (filters.platform && filters.platform !== '') {
            query += ' AND platform = ?';
            params.push(filters.platform);
        }
        if (filters.genre && filters.genre !== '') {
            query += ' AND genre = ?';
            params.push(filters.genre);
        }
        if (filters.status && filters.status !== '') {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        const stmt = db.prepare(query);
        return stmt.all(...params);
    }

    getById(id, userId) {
        const stmt = db.prepare('SELECT * FROM games WHERE id = ? AND userId = ?');
        return stmt.get(id, userId);
    }

    create(title, platform, genre, status, userId) {
        const stmt = db.prepare('INSERT INTO games (title, platform, genre, status, userId) VALUES (?, ?, ?, ?, ?)');
        return stmt.run(title, platform, genre, status, userId);
    }

    update(id, title, platform, genre, status, userId) {
        const stmt = db.prepare('UPDATE games SET title = ?, platform = ?, genre = ?, status = ? WHERE id = ? AND userId = ?');
        return stmt.run(title, platform, genre, status, id, userId);
    }

    delete(id, userId) {
        const stmt = db.prepare('DELETE FROM games WHERE id = ? AND userId = ?');
        return stmt.run(id, userId);
    }
}

module.exports = new GameDAO();