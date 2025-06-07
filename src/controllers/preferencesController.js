// src/controllers/preferencesController.js
const UserPreferences = require('../models/UserPreferences');
const { validatePreferences } = require('../utils/validation');

// Obtenir les préférences utilisateur
const getPreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    
    let preferences = await UserPreferences.findOne({ userId });
    
    // Si aucune préférence n'existe, créer avec les valeurs par défaut
    if (!preferences) {
      preferences = new UserPreferences({ userId });
      await preferences.save();
    }
    
    res.json({
      preferences: {
        soundEnabled: preferences.soundEnabled,
        musicEnabled: preferences.musicEnabled,
        soundVolume: preferences.soundVolume,
        musicVolume: preferences.musicVolume,
        darkMode: preferences.darkMode,
        animationsEnabled: preferences.animationsEnabled,
        language: preferences.language,
        difficulty: preferences.difficulty,
        showHints: preferences.showHints,
        autoSave: preferences.autoSave,
        notificationsEnabled: preferences.notificationsEnabled,
        parentalControl: preferences.parentalControl,
        lastUpdated: preferences.updatedAt
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des préférences:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des préférences' });
  }
};

// Sauvegarder les préférences utilisateur
const savePreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    const preferencesData = req.body;
    
    // Validation des données
    const validationError = validatePreferences(preferencesData);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    
    // Chercher les préférences existantes ou créer de nouvelles
    let preferences = await UserPreferences.findOne({ userId });
    
    if (preferences) {
      // Mettre à jour les préférences existantes
      Object.assign(preferences, preferencesData);
    } else {
      // Créer de nouvelles préférences
      preferences = new UserPreferences({
        userId,
        ...preferencesData
      });
    }
    
    await preferences.save();
    
    res.json({
      message: 'Préférences sauvegardées avec succès',
      preferences: {
        soundEnabled: preferences.soundEnabled,
        musicEnabled: preferences.musicEnabled,
        soundVolume: preferences.soundVolume,
        musicVolume: preferences.musicVolume,
        darkMode: preferences.darkMode,
        animationsEnabled: preferences.animationsEnabled,
        language: preferences.language,
        difficulty: preferences.difficulty,
        showHints: preferences.showHints,
        autoSave: preferences.autoSave,
        notificationsEnabled: preferences.notificationsEnabled,
        parentalControl: preferences.parentalControl,
        lastUpdated: preferences.updatedAt
      }
    });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des préférences:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la sauvegarde des préférences' });
  }
};

// Réinitialiser les préférences aux valeurs par défaut
const resetPreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Valeurs par défaut
    const defaultPreferences = {
      soundEnabled: true,
      musicEnabled: true,
      soundVolume: 75,
      musicVolume: 60,
      darkMode: true,
      animationsEnabled: true,
      language: 'fr',
      difficulty: 'normal',
      showHints: true,
      autoSave: true,
      notificationsEnabled: true,
      parentalControl: false
    };
    
    let preferences = await UserPreferences.findOne({ userId });
    
    if (preferences) {
      // Mettre à jour avec les valeurs par défaut
      Object.assign(preferences, defaultPreferences);
    } else {
      // Créer avec les valeurs par défaut
      preferences = new UserPreferences({
        userId,
        ...defaultPreferences
      });
    }
    
    await preferences.save();
    
    res.json({
      message: 'Préférences réinitialisées aux valeurs par défaut',
      preferences: {
        soundEnabled: preferences.soundEnabled,
        musicEnabled: preferences.musicEnabled,
        soundVolume: preferences.soundVolume,
        musicVolume: preferences.musicVolume,
        darkMode: preferences.darkMode,
        animationsEnabled: preferences.animationsEnabled,
        language: preferences.language,
        difficulty: preferences.difficulty,
        showHints: preferences.showHints,
        autoSave: preferences.autoSave,
        notificationsEnabled: preferences.notificationsEnabled,
        parentalControl: preferences.parentalControl,
        lastUpdated: preferences.updatedAt
      }
    });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation des préférences:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la réinitialisation des préférences' });
  }
};

module.exports = {
  getPreferences,
  savePreferences,
  resetPreferences
};