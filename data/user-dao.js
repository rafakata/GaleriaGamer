const db = require('./database');
const bcrypt = require('bcryptjs');

class UserDAO {
    // Buscar usuario por email
    getUserByEmail(email) {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        return stmt.get(email);
    }

    // Crear usuario nuevo
    createUser(name, email, password) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
        const info = stmt.run(name, email, hash);
        return info.lastInsertRowid;
    }
}

module.exports = new UserDAO();