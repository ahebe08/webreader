const express = require('express');
const {
  getAllBooks,
  getBookById,
  getBookPDF,
  createBook,
  updateReadingProgress,
  getReadingStats,
  getGenres,
  createSampleBooks
} = require('../controllers/bookController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { validateBook, validateReadingProgress } = require('../middleware/validation');
const { uploadPDF, handleUploadError } = require('../config/upload');

const router = express.Router();

// Routes publiques
router.get('/', optionalAuth, getAllBooks);
router.get('/genres', getGenres);
router.get('/:id', optionalAuth, getBookById);
router.get('/:id/pdf', getBookPDF);

// Routes protégées
router.post('/:id/progress', authenticate, validateReadingProgress, updateReadingProgress);
router.get('/user/stats', authenticate, getReadingStats);

// Routes d'administration (à protéger avec un rôle admin en production)
router.post('/', authenticate, uploadPDF.single('pdf'), validateBook, handleUploadError, createBook);
router.post('/samples/create', authenticate, createSampleBooks);

module.exports = router;