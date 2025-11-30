const express = require('express');
const path = require('path');

const router = express.Router();

// Importar sub-routers
const authRoutes = require('./auth.routes');
const profileRoutes = require('./profile.routes');
const gamesRoutes = require('./games.routes');

// API Routes
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/games', gamesRoutes);

// Static pages (HTML)
router.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../src/views/index_logInPending.html'));
});

router.get('/information', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../src/views/info.html'));
});

router.get('/rules', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../src/views/rules.html'));
});

module.exports = router;