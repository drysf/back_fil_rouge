// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/env');
const { validateRegistration, validateLogin } = require('../utils/validation');

// Inscription
const register = async (req, res) => {
  try {
    const { username, email, password, age } = req.body;

    // Validation des données
    const validationError = validateRegistration({ username, email, password, age });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({ 
        error: 'Un utilisateur avec cet email ou nom d\'utilisateur existe déjà' 
      });
    }

    // Créer le nouvel utilisateur
    const user = new User({
      username,
      email,
      password,
      age: parseInt(age)
    });

    await user.save();

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        age: user.age
      },
      token
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
  }
};

// Connexion
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation des données
    const validationError = validateLogin({ email, password });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Connexion réussie',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        age: user.age
      },
      token
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
  }
};

module.exports = {
  register,
  login
};