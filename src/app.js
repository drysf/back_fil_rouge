// src/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importation des routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const friendRoutes = require('./routes/friends');

// Connexion à la base de données
require('./config/database');

const app = express();

// Middleware globaux
app.use(express.json());
app.use(cors());

// Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', friendRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API PlayGreenKids fonctionne correctement',
    timestamp: new Date().toISOString()
  });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Cette route n\'existe pas' });
});

// Gestionnaire d'erreurs global
app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  res.status(500).json({ 
    error: 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  });
});

module.exports = app;