const express = require('express');
const { 
  register, 
  login, 
  getProfile, 
  updateProfile 
} = require('../controllers/authController');
const { 
  validateRegistration, 
  validateLogin 
} = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Routes publiques
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

// Routes protégées
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

module.exports = router;