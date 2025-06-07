// src/routes/friends.js
const express = require('express');
const {
    sendFriendRequest,
    respondToFriendRequest,
    getFriends,
    getFriendRequests,
    removeFriend,
    blockUser
} = require('../controllers/friendController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/friends/request', authenticateToken, sendFriendRequest);
router.put('/friends/respond', authenticateToken, respondToFriendRequest);
router.get('/friends', authenticateToken, getFriends);
router.get('/friends/requests', authenticateToken, getFriendRequests);
router.delete('/friends/:friendId', authenticateToken, removeFriend);
router.post('/friends/block', authenticateToken, blockUser);

module.exports = router;