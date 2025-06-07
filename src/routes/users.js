// src/routes/users.js
const express = require('express');
const { getProfile, getAllUsers } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', authenticateToken, getProfile);
router.get('/users', authenticateToken, getAllUsers);

module.exports = router;
