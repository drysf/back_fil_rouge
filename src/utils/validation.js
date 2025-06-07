// src/utils/validation.js

// Validation pour l'inscription
const validateRegistration = ({ username, email, password, age }) => {
  // Vérifier que tous les champs sont fournis
  if (!username || !email || !password || !age) {
    return 'Tous les champs sont requis (username, email, password, age)';
  }

  // Validation du nom d'utilisateur
  if (username.length < 3 || username.length > 30) {
    return 'Le nom d\'utilisateur doit contenir entre 3 et 30 caractères';
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores';
  }

  // Validation de l'email
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return 'Format d\'email invalide';
  }

  // Validation du mot de passe
  if (password.length < 6) {
    return 'Le mot de passe doit contenir au moins 6 caractères';
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
  }

  // Validation de l'âge
  const ageNum = parseInt(age);
  if (isNaN(ageNum) || ageNum < 3 || ageNum > 120) {
    return 'L\'âge doit être un nombre entre 3 et 120 ans';
  }

  return null; // Pas d'erreur
};

// Validation pour la connexion
const validateLogin = ({ email, password }) => {
  if (!email || !password) {
    return 'Email et mot de passe requis';
  }

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return 'Format d\'email invalide';
  }

  return null; // Pas d'erreur
};

// Validation pour les préférences utilisateur
const validatePreferences = (preferences) => {
  const {
    soundEnabled,
    musicEnabled,
    soundVolume,
    musicVolume,
    darkMode,
    animationsEnabled,
    language,
    difficulty,
    showHints,
    autoSave,
    notificationsEnabled,
    parentalControl
  } = preferences;

  // Validation des booléens
  const booleanFields = {
    soundEnabled,
    musicEnabled,
    darkMode,
    animationsEnabled,
    showHints,
    autoSave,
    notificationsEnabled,
    parentalControl
  };

  for (const [field, value] of Object.entries(booleanFields)) {
    if (value !== undefined && typeof value !== 'boolean') {
      return `${field} doit être un booléen`;
    }
  }

  // Validation des volumes
  if (soundVolume !== undefined) {
    const vol = parseInt(soundVolume);
    if (isNaN(vol) || vol < 0 || vol > 100) {
      return 'Le volume des sons doit être entre 0 et 100';
    }
  }

  if (musicVolume !== undefined) {
    const vol = parseInt(musicVolume);
    if (isNaN(vol) || vol < 0 || vol > 100) {
      return 'Le volume de la musique doit être entre 0 et 100';
    }
  }

  // Validation de la langue
  if (language !== undefined && !['fr', 'en'].includes(language)) {
    return 'La langue doit être "fr" ou "en"';
  }

  // Validation de la difficulté
  if (difficulty !== undefined && !['easy', 'normal', 'hard', 'expert'].includes(difficulty)) {
    return 'La difficulté doit être "easy", "normal", "hard" ou "expert"';
  }

  return null; // Pas d'erreur
};

// Validation pour les IDs MongoDB
const validateObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

// Sanitisation des données d'entrée
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  return input
    .trim()
    .replace(/[<>]/g, '') // Supprimer les balises HTML basiques
    .substring(0, 1000); // Limiter la longueur
};

// Validation des paramètres de pagination
const validatePagination = ({ page = 1, limit = 10 }) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  if (isNaN(pageNum) || pageNum < 1) {
    return { error: 'Le numéro de page doit être un entier positif' };
  }

  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return { error: 'La limite doit être un entier entre 1 et 100' };
  }

  return {
    page: pageNum,
    limit: limitNum,
    skip: (pageNum - 1) * limitNum
  };
};

module.exports = {
  validateRegistration,
  validateLogin,
  validatePreferences,
  validateObjectId,
  sanitizeInput,
  validatePagination
};