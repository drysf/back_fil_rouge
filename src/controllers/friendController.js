// src/controllers/friendController.js
const User = require('../models/User');
const Friendship = require('../models/Friendship');

// Envoyer une demande d'amitié
const sendFriendRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const requesterId = req.user._id;

    // Vérifications
    if (!recipientId) {
      return res.status(400).json({ error: 'ID du destinataire requis' });
    }

    if (recipientId === requesterId.toString()) {
      return res.status(400).json({ error: 'Vous ne pouvez pas vous ajouter vous-même' });
    }

    // Vérifier que le destinataire existe
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    // Vérifier si une relation existe déjà
    const existingFriendship = await Friendship.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ]
    });

    if (existingFriendship) {
      if (existingFriendship.status === 'accepted') {
        return res.status(409).json({ error: 'Vous êtes déjà amis' });
      } else if (existingFriendship.status === 'pending') {
        return res.status(409).json({ error: 'Demande d\'amitié déjà envoyée' });
      } else if (existingFriendship.status === 'blocked') {
        return res.status(403).json({ error: 'Impossible d\'envoyer une demande d\'amitié' });
      }
    }

    // Créer la demande d'amitié
    const friendship = new Friendship({
      requester: requesterId,
      recipient: recipientId,
      status: 'pending'
    });

    await friendship.save();
    await friendship.populate('recipient', 'username email age');

    res.status(201).json({
      message: 'Demande d\'amitié envoyée',
      friendship: {
        id: friendship._id,
        recipient: friendship.recipient,
        status: friendship.status,
        createdAt: friendship.createdAt
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi de la demande d\'amitié:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Répondre à une demande d'amitié
const respondToFriendRequest = async (req, res) => {
  try {
    const { friendshipId, action } = req.body;
    const userId = req.user._id;

    if (!friendshipId || !action) {
      return res.status(400).json({ error: 'ID de l\'amitié et action requis' });
    }

    if (!['accept', 'decline'].includes(action)) {
      return res.status(400).json({ error: 'Action invalide (accept/decline)' });
    }

    // Trouver la demande d'amitié
    const friendship = await Friendship.findById(friendshipId);
    if (!friendship) {
      return res.status(404).json({ error: 'Demande d\'amitié introuvable' });
    }

    // Vérifier que l'utilisateur est le destinataire
    if (friendship.recipient.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Non autorisé à répondre à cette demande' });
    }

    if (friendship.status !== 'pending') {
      return res.status(400).json({ error: 'Cette demande a déjà été traitée' });
    }

    // Mettre à jour le statut
    friendship.status = action === 'accept' ? 'accepted' : 'declined';
    await friendship.save();
    await friendship.populate(['requester', 'recipient'], 'username email age');

    res.json({
      message: `Demande d'amitié ${action === 'accept' ? 'acceptée' : 'refusée'}`,
      friendship: {
        id: friendship._id,
        requester: friendship.requester,
        recipient: friendship.recipient,
        status: friendship.status,
        updatedAt: friendship.updatedAt
      }
    });

  } catch (error) {
    console.error('Erreur lors de la réponse à la demande d\'amitié:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Obtenir la liste des amis
const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const friendships = await Friendship.find({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' }
      ]
    }).populate(['requester', 'recipient'], 'username email age createdAt');

    // Formater la liste des amis
    const friends = friendships.map(friendship => {
      const friend = friendship.requester._id.toString() === userId.toString() 
        ? friendship.recipient 
        : friendship.requester;
      
      return {
        id: friend._id,
        username: friend.username,
        email: friend.email,
        age: friend.age,
        friendsSince: friendship.updatedAt
      };
    });

    res.json({ friends });

  } catch (error) {
    console.error('Erreur lors de la récupération des amis:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Obtenir les demandes d'amitié
const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    // Demandes reçues
    const receivedRequests = await Friendship.find({
      recipient: userId,
      status: 'pending'
    }).populate('requester', 'username email age').sort({ createdAt: -1 });

    // Demandes envoyées
    const sentRequests = await Friendship.find({
      requester: userId,
      status: 'pending'
    }).populate('recipient', 'username email age').sort({ createdAt: -1 });

    res.json({
      received: receivedRequests.map(req => ({
        id: req._id,
        user: req.requester,
        createdAt: req.createdAt
      })),
      sent: sentRequests.map(req => ({
        id: req._id,
        user: req.recipient,
        createdAt: req.createdAt
      }))
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des demandes d\'amitié:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Supprimer un ami
const removeFriend = async (req, res) => {
  try {
    const userId = req.user._id;
    const friendId = req.params.friendId;

    // Trouver la relation d'amitié
    const friendship = await Friendship.findOne({
      $or: [
        { requester: userId, recipient: friendId, status: 'accepted' },
        { requester: friendId, recipient: userId, status: 'accepted' }
      ]
    });

    if (!friendship) {
      return res.status(404).json({ error: 'Amitié introuvable' });
    }

    await Friendship.findByIdAndDelete(friendship._id);

    res.json({ message: 'Ami supprimé avec succès' });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'ami:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Bloquer un utilisateur
const blockUser = async (req, res) => {
  try {
    const { userId: targetUserId } = req.body;
    const currentUserId = req.user._id;

    if (!targetUserId) {
      return res.status(400).json({ error: 'ID utilisateur requis' });
    }

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ error: 'Vous ne pouvez pas vous bloquer vous-même' });
    }

    // Vérifier que l'utilisateur existe
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    // Supprimer toute relation existante
    await Friendship.findOneAndDelete({
      $or: [
        { requester: currentUserId, recipient: targetUserId },
        { requester: targetUserId, recipient: currentUserId }
      ]
    });

    // Créer une relation bloquée
    const blockRelation = new Friendship({
      requester: currentUserId,
      recipient: targetUserId,
      status: 'blocked'
    });

    await blockRelation.save();

    res.json({ message: 'Utilisateur bloqué avec succès' });

  } catch (error) {
    console.error('Erreur lors du blocage:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = {
  sendFriendRequest,
  respondToFriendRequest,
  getFriends,
  getFriendRequests,
  removeFriend,
  blockUser
};