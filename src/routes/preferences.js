// src/routes/preferences.js
const express = require('express');
const {
  getPreferences,
  savePreferences,
  resetPreferences
} = require('../controllers/preferencesController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/preferences - Récupérer les préférences utilisateur
router.get('/preferences', authenticateToken, getPreferences);

// PUT /api/preferences - Sauvegarder les préférences utilisateur
router.put('/preferences', authenticateToken, savePreferences);

// POST /api/preferences/reset - Réinitialiser les préférences
router.post('/preferences/reset', authenticateToken, resetPreferences);

module.exports = router;