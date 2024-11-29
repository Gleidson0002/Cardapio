var express = require('express');
var router = express.Router();

// Página inicial
router.get('/', function(req, res, next) {
  res.render('index'); // Renderiza "views/index.ejs"
});

// Página de combos
router.get('/combo', function(req, res, next) {
  res.render('combo'); // Renderiza "views/combo.ejs"
});

// Página de bebidas
router.get('/bebida', function(req, res, next) {
  res.render('bebida'); // Renderiza "views/bebida.ejs"
});

router.get('/telacarrinho', function(req, res, next) {
  res.render('telacarrinho'); // Renderiza "views/bebida.ejs"
});

router.get('/login', function(req, res, next) {
  res.render('login'); // Renderiza "views/bebida.ejs"
});

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard'); // Renderiza "views/bebida.ejs"
});

router.get('/firestore', function(req, res, next) {
  res.render('app'); // Renderiza "views/bebida.ejs"
});

router.get('/pedidos', function(req, res, next) {
  res.render('pedidos'); // Renderiza "views/bebida.ejs"
});

router.get('/reservas', function(req, res, next) {
  res.render('reservas'); // Renderiza "views/bebida.ejs"
});

router.get('/script', function(req, res, next) {
  res.render('script'); // Renderiza "views/bebida.ejs"
});

module.exports = router;
