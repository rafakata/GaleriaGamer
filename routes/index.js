const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const userDAO = require('../data/user-dao');
const gameDAO = require('../data/game-dao');
const isAuthenticated = require('../middlewares/auth');

// --- RUTAS DE AUTENTICACIÓN ---

// Login (GET)
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Login (POST)
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = userDAO.getUserByEmail(email);

    if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.redirect('/');
    } else {
        res.render('login', { error: "Credenciales incorrectas" });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Registro rápido (para pruebas)
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    try {
        userDAO.createUser(name, email, password);
        res.redirect('/login');
    } catch (err) {
        res.render('login', { error: "El email ya existe" });
    }
});

// --- RUTAS DE VIDEOJUEGOS (Protegidas) ---

// Listado (Dashboard) con Filtros
router.get('/', isAuthenticated, (req, res) => {
    // Recogemos los filtros de la URL (query strings)
    const filters = {
        platform: req.query.platform,
        genre: req.query.genre,
        status: req.query.status
    };
    
    const games = gameDAO.getAll(req.session.user.id, filters);
    res.render('games-list', { user: req.session.user, games, filters });
});

// Formulario de Crear (GET)
router.get('/games/new', isAuthenticated, (req, res) => {
    res.render('game-form', { user: req.session.user, game: null });
});

// Crear Juego (POST)
router.post('/games/new', isAuthenticated, (req, res) => {
    const { title, platform, genre, status } = req.body;
    gameDAO.create(title, platform, genre, status, req.session.user.id);
    res.redirect('/');
});

// Formulario de Editar (GET)
router.get('/games/edit/:id', isAuthenticated, (req, res) => {
    const game = gameDAO.getById(req.params.id, req.session.user.id);
    if (!game) return res.redirect('/');
    res.render('game-form', { user: req.session.user, game });
});

// Editar Juego (POST)
router.post('/games/edit/:id', isAuthenticated, (req, res) => {
    const { title, platform, genre, status } = req.body;
    gameDAO.update(req.params.id, title, platform, genre, status, req.session.user.id);
    res.redirect('/');
});

// Borrar Juego
router.get('/games/delete/:id', isAuthenticated, (req, res) => {
    gameDAO.delete(req.params.id, req.session.user.id);
    res.redirect('/');
});

module.exports = router;