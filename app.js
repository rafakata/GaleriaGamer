const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts'); // IMPORTANTE: Necesitas instalar esto si no lo hiciste, pero mejor lo hacemos manual como en todo-list usando include o layout property

// NOTA: El repositorio todo-list usa layout.ejs automáticamente si está configurado. 
// Vamos a usar la configuración estándar simple.

const indexRouter = require('./routes/index');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Habilitar layouts
app.use(expressLayouts);
app.set('layout', 'layout'); // Busca layout.ejs por defecto

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Sesión
app.use(session({
  secret: 'reto4aSecretKeyVideoGames', // Clave secreta para firmar cookies
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // false para http (localhost), true para https
}));

// Variable local para vistas (usuario)
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.use('/', indexRouter);

// Catch 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error'); // Necesitarás un error.ejs básico o renderizar texto
});

module.exports = app;