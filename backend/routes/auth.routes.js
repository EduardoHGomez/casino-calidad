const express = require('express');
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middlewares/validationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// POST /auth/register
router.post('/register', 
  validateRegister,           // 1. Validar inputs
  authController.register     // 2. Procesar
);

// POST /auth/login
router.post('/login', 
  validateLogin,              // 1. Validar inputs
  authController.login        // 2. Procesar
);

// GET /auth/me (usuario actual - requiere autenticación)
router.get('/me', 
  authMiddleware,             // 1. Verificar JWT
  authController.getCurrentUser
);

module.exports = router;