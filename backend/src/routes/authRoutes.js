// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// --- DIAGNÓSTICO DE ERRO --- PODE TIRAR DEPOIS (SE NAO ACHAR NECESSARIO)
console.log('register:', typeof authController.register);
console.log('login:', typeof authController.login);
console.log('verifyResetCode:', typeof authController.verifyResetCode);
console.log('resetPassword:', typeof authController.resetPassword);
console.log('authMiddleware:', typeof authMiddleware);
// ----------------------------

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-reset-code', authController.verifyResetCode);
router.post('/reset-password', authMiddleware, authController.resetPassword);

module.exports = router;