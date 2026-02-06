const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer'); // PARA SUBIR LAS FOTOS
const path = require('path');
const userDAO = require('../data/user-dao');
const gameDAO = require('../data/game-dao');
const isAuthenticated = require('../middlewares/auth');

// --- CONFIGURACIÓN MULTER (Subida de archivos) ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/uploads/') // Carpeta destino
    },
    filename: function (req, file, cb) {
        // Generamos nombre único: fecha + nombre original
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage });


// --- RUTAS DE AUTENTICACIÓN ---
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

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

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    try {
        userDAO.createUser(name, email, password);
        res.redirect('/login');
    } catch (err) {
        res.render('login', { error: "El email ya existe" });
    }
});


// --- RUTAS DE VIDEOJUEGOS ---

// Listado
router.get('/', isAuthenticated, (req, res) => {
    const filters = {
        platform: req.query.platform,
        genre: req.query.genre,
        status: req.query.status
    };
    
    const games = gameDAO.getAll(req.session.user.id, filters);
    res.render('games-list', { user: req.session.user, games, filters });
});

router.get('/games/new', isAuthenticated, (req, res) => {
    res.render('game-form', { user: req.session.user, game: null });
});

// Crear Juego (POST) - AÑADIDO: upload.single('image')
router.post('/games/new', isAuthenticated, upload.single('image'), (req, res) => {
    const { title, platform, genre, status } = req.body;
    // Si subió archivo, cogemos el nombre, si no, null
    const image = req.file ? req.file.filename : null; 
    
    gameDAO.create(title, platform, genre, status, image, req.session.user.id);
    res.redirect('/');
});

router.get('/games/edit/:id', isAuthenticated, (req, res) => {
    const game = gameDAO.getById(req.params.id, req.session.user.id);
    if (!game) return res.redirect('/');
    res.render('game-form', { user: req.session.user, game });
});

// Editar Juego (POST) - AÑADIDO: upload.single('image')
router.post('/games/edit/:id', isAuthenticated, upload.single('image'), (req, res) => {
    const { title, platform, genre, status } = req.body;
    const image = req.file ? req.file.filename : null; // Si hay nueva imagen
    
    gameDAO.update(req.params.id, title, platform, genre, status, image, req.session.user.id);
    res.redirect('/');
});

router.get('/games/delete/:id', isAuthenticated, (req, res) => {
    gameDAO.delete(req.params.id, req.session.user.id);
    res.redirect('/');
});

module.exports = router;