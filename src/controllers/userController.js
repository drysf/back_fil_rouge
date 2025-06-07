// src/controllers/userController.js
const User = require('../models/User');
const Friendship = require('../models/Friendship');

// Obtenir le profil utilisateur
const getProfile = async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        age: req.user.age,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Lister tous les utilisateurs (excluant les bloqués)
const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    
    // Récupérer tous les utilisateurs sauf l'utilisateur actuel
    const users = await User.find({ _id: { $ne: currentUserId } }, '-password').sort({ createdAt: -1 });
    
    // Récupérer les relations de l'utilisateur actuel pour filtrer les utilisateurs bloqués
    const blockedRelations = await Friendship.find({
      $or: [
        { requester: currentUserId, status: 'blocked' },
        { recipient: currentUserId, status: 'blocked' }
      ]
    });
    
    // Extraire les IDs des utilisateurs bloqués
    const blockedUserIds = blockedRelations.map(rel => {
      return rel.requester.toString() === currentUserId.toString() 
        ? rel.recipient.toString() 
        : rel.requester.toString();
    });
    
    // Filtrer les utilisateurs bloqués
    const filteredUsers = users.filter(user => 
      !blockedUserIds.includes(user._id.toString())
    );
    
    console.log(`Total utilisateurs: ${users.length}, Après filtrage blocages: ${filteredUsers.length}`);
    
    res.json({ users: filteredUsers });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = {
  getProfile,
  getAllUsers
};