// backend/src/routes/viewRoutes.js
const express = require('express');
const path = require('path');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Define a pasta raiz de onde os arquivos estáticos serão buscados
const pastaFrontend = path.join(__dirname, '../../../frontend');

// Redireciona quem entra na raiz "/" direto para o "/login"
router.get('/', (req, res) => {
  res.redirect('/login');
}); 

// Rotas públicas: qualquer um pode acessar
router.get('/login', (req, res) => {
  res.sendFile(path.join(pastaFrontend, 'pages/login.html'));
});

router.get('/register', (req, res) => {
  res.sendFile(path.join(pastaFrontend, 'pages/register.html'));
});

router.get('/redefine', (req, res) => {
  res.sendFile(path.join(pastaFrontend, 'pages/redefine.html'));
});

// Rotas privadas: o middleware roda ANTES de executar res.sendFile
router.get('/loading', authMiddleware, (req, res) => {
  res.sendFile(path.join(pastaFrontend, 'pages/loading.html'));
});

router.get('/newPassword', authMiddleware, (req, res) => {
  res.sendFile(path.join(pastaFrontend, 'pages/newPassword.html'));
});

module.exports = router; 