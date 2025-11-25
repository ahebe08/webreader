const express = require('express');
const {
  getAllBooks,
  getBookById,
  getBookPDF,
  updateReadingProgress,
  createSampleBooks
} = require('../controllers/bookController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.get('/:id/pdf', getBookPDF);

// Protected routes
router.post('/:id/progress', authenticate, updateReadingProgress);

// Admin route for testing (would normally be protected)
router.post('/samples/create', createSampleBooks);

module.exports = router;