// src/config/database.js
const mongoose = require('mongoose');
const { MONGODB_URI } = require('./env');

// Connexion à MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => console.error('❌ Erreur de connexion MongoDB:', err));

module.exports = mongoose;

