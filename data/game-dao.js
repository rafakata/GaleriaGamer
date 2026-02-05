const db = require('./database');

class GameDAO {
    // Obtener juegos con filtros
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

    // AÑADIDO: parámetro image
    create(title, platform, genre, status, image, userId) {
        const stmt = db.prepare('INSERT INTO games (title, platform, genre, status, image, userId) VALUES (?, ?, ?, ?, ?, ?)');
        return stmt.run(title, platform, genre, status, image, userId);
    }

    // AÑADIDO: parámetro image (si es null, no se actualiza la imagen)
    update(id, title, platform, genre, status, image, userId) {
        // Lógica: Si el usuario sube imagen nueva, la actualizamos. Si no, mantenemos la vieja.
        if (image) {
            const stmt = db.prepare('UPDATE games SET title = ?, platform = ?, genre = ?, status = ?, image = ? WHERE id = ? AND userId = ?');
            return stmt.run(title, platform, genre, status, image, id, userId);
        } else {
            const stmt = db.prepare('UPDATE games SET title = ?, platform = ?, genre = ?, status = ? WHERE id = ? AND userId = ?');
            return stmt.run(title, platform, genre, status, id, userId);
        }
    }

    delete(id, userId) {
        const stmt = db.prepare('DELETE FROM games WHERE id = ? AND userId = ?');
        return stmt.run(id, userId);
    }
}

module.exports = new GameDAO();