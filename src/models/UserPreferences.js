// src/models/UserPreferences.js
const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Préférences audio
  soundEnabled: {
    type: Boolean,
    default: true
  },
  musicEnabled: {
    type: Boolean,
    default: true
  },
  soundVolume: {
    type: Number,
    default: 75,
    min: 0,
    max: 100
  },
  musicVolume: {
    type: Number,
    default: 60,
    min: 0,
    max: 100
  },
  
  // Préférences d'affichage
  darkMode: {
    type: Boolean,
    default: true
  },
  animationsEnabled: {
    type: Boolean,
    default: true
  },
  language: {
    type: String,
    enum: ['fr', 'en'],
    default: 'fr'
  },
  
  // Préférences de jeu
  difficulty: {
    type: String,
    enum: ['easy', 'normal', 'hard', 'expert'],
    default: 'normal'
  },
  showHints: {
    type: Boolean,
    default: true
  },
  autoSave: {
    type: Boolean,
    default: true
  },
  
  // Préférences de sécurité
  notificationsEnabled: {
    type: Boolean,
    default: true
  },
  parentalControl: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes par userId
userPreferencesSchema.index({ userId: 1 });

module.exports = mongoose.model('UserPreferences', userPreferencesSchema);