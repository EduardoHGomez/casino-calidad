const express = require('express');
const profileController = require('../controllers/profileController');
const balanceController = require('../controllers/balanceController');
const activityController = require('../controllers/activityController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Todas las rutas de perfil requieren autenticación
router.use(authMiddleware);

// Profile
router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);

// Balance
router.get('/balance', balanceController.getBalance);
router.put('/balance', balanceController.updateBalance);

// Activity
router.get('/activity', activityController.getActivityHistory);
router.get('/activity/recent', activityController.getRecentActivity);

module.exports = router;