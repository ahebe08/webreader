const Book = require('../models/Book');
const path = require('path');
const fs = require('fs');
const { pool } = require('../config/database');

const getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const search = req.query.search || '';
    const genre = req.query.genre || '';

    const result = await Book.findAll(page, limit, search, genre);

    res.json({
      success: true,
      message: 'Livres récupérés avec succès',
      data: {
        livres: result.livres,
        pagination: {
          page: result.page,
          pagesTotales: result.totalPages,
          totalLivres: result.total,
          aSuivant: result.page < result.totalPages,
          aPrecedent: result.page > 1
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des livres:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur interne du serveur lors de la récupération des livres.' 
    });
  }
};

const getBookById = async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ 
        success: false,
        error: 'Livre non trouvé.' 
      });
    }

    // Obtenir la session de lecture si l'utilisateur est authentifié
    let sessionLecture = null;
    if (req.userId) {
      sessionLecture = await Book.getReadingSession(req.userId, bookId);
    }

    res.json({
      success: true,
      message: 'Livre récupéré avec succès',
      data: {
        ...book,
        sessionLecture
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du livre:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur interne du serveur lors de la récupération du livre.' 
    });
  }
};

const getBookPDF = async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const book = await Book.findById(bookId);

    console.log('🔍 [DEBUG] Book found:', book);

    if (!book) {
      return res.status(404).json({ 
        success: false,
        error: 'Livre non trouvé.' 
      });
    }

    if (!book.pdf_path) {
      return res.status(404).json({ 
        success: false,
        error: 'PDF non disponible pour ce livre.' 
      });
    }

    const pdfPath = path.join('/app/uploads/pdfs', book.pdf_path);
    console.log('🔍 [DEBUG] Looking for PDF at:', pdfPath);
    console.log('🔍 [DEBUG] File exists?', fs.existsSync(pdfPath));
    
    // Vérifier si le fichier existe
    if (!fs.existsSync(pdfPath)) {
      console.log('❌ [DEBUG] PDF NOT FOUND at:', pdfPath);
      return res.status(404).json({ 
        success: false,
        error: 'Fichier PDF non trouvé sur le serveur.' 
      });
    }

    // Obtenir les statistiques du fichier
    const stats = fs.statSync(pdfPath);

    // Définir les en-têtes pour le PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-Disposition', `inline; filename="${book.title}.pdf"`);
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache 1 heure

    // Stream le fichier PDF
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Erreur lors de la récupération du PDF:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur interne du serveur lors de la récupération du PDF.' 
    });
  }
};

const createBook = async (req, res) => {
  try {
    console.log('📤 Upload request received');
    console.log('📁 File object:', req.file); // ← Vérifie si le fichier est présent
    console.log('📝 Body data:', req.body);   // ← Vérifie les autres données

    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({ 
        success: false,
        error: 'Un fichier PDF est requis.' 
      });
    }

    console.log('✅ File uploaded successfully:', req.file.filename);

    const {
      title,
      author,
      year,
      description,
      genre,
      publisher,
      isbn,
      page_count,
      language
    } = req.body;

    // Vérifier qu'un PDF a été uploadé
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'Un fichier PDF est requis.' 
      });
    }

    const bookData = {
      title,
      author,
      year: year ? parseInt(year) : null,
      description,
      genre,
      publisher,
      isbn,
      page_count: page_count ? parseInt(page_count) : null,
      pdf_path: req.file.filename,
      file_size: req.file.size,
      language: language || 'fr',
      cover_image: req.body.cover_image || null
    };

    const book = await Book.create(bookData);

    res.status(201).json({
      success: true,
      message: 'Livre créé avec succès',
      data: book
    });
  } catch (error) {
    console.error('Erreur lors de la création du livre:', error);
    
    // Nettoyer le fichier uploadé en cas d'erreur
    if (req.file) {
      fs.unlinkSync(path.join(__dirname, '../../../uploads/pdfs', req.file.filename));
    }

    res.status(500).json({ 
      success: false,
      error: 'Erreur interne du serveur lors de la création du livre.' 
    });
  }
};

const updateReadingProgress = async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const { lastPage, progress } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ 
        success: false,
        error: 'Livre non trouvé.' 
      });
    }

    const sessionLecture = await Book.updateReadingSession(
      req.userId, 
      bookId, 
      lastPage, 
      progress
    );

    res.json({
      success: true,
      message: 'Progression de lecture mise à jour avec succès',
      data: sessionLecture
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la progression:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur interne du serveur lors de la mise à jour de la progression.' 
    });
  }
};

const getReadingStats = async (req, res) => {
  try {
    const stats = await Book.getUserReadingStats(req.userId);

    res.json({
      success: true,
      message: 'Statistiques de lecture récupérées avec succès',
      data: {
        livresLus: parseInt(stats.total_books_read) || 0,
        progressionTotale: parseFloat(stats.total_progress) || 0,
        progressionMoyenne: parseFloat(stats.average_progress) || 0
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur interne du serveur lors de la récupération des statistiques.' 
    });
  }
};

const getGenres = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT genre 
      FROM books 
      WHERE genre IS NOT NULL AND genre != '' 
      ORDER BY genre
    `);

    const genres = result.rows.map(row => row.genre);

    res.json({
      success: true,
      message: 'Genres récupérés avec succès',
      data: genres
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des genres:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur interne du serveur lors de la récupération des genres.' 
    });
  }
};

// Données d'exemple pour les tests
const createSampleBooks = async (req, res) => {
  try {
    const sampleBooks = [
      {
        title: "Le Petit Prince",
        author: "Antoine de Saint-Exupéry",
        year: 1943,
        description: "Conte poétique et philosophique sous l'apparence d'un conte pour enfants.",
        genre: "Classique",
        publisher: "Gallimard",
        isbn: "9782070404992",
        page_count: 96,
        cover_image: "petit-prince.jpg",
        pdf_path: "sample1.pdf",
        language: "fr"
      },
      {
        title: "L'Étranger",
        author: "Albert Camus",
        year: 1942,
        description: "Roman qui explore l'absurdité de la condition humaine à travers le personnage de Meursault.",
        genre: "Philosophique",
        publisher: "Gallimard",
        isbn: "9782070360021",
        page_count: 185,
        cover_image: "etranger.jpg",
        pdf_path: "sample2.pdf",
        language: "fr"
      },
      {
        title: "Les Misérables",
        author: "Victor Hugo",
        year: 1862,
        description: "Roman historique qui suit la vie de Jean Valjean sur plusieurs décennies.",
        genre: "Classique",
        publisher: "A. Lacroix, Verboeckhoven & Cie",
        isbn: "9782253004718",
        page_count: 1232,
        cover_image: "miserables.jpg",
        pdf_path: "sample3.pdf",
        language: "fr"
      }
    ];

    const livresCrees = [];
    for (const bookData of sampleBooks) {
      const book = await Book.create(bookData);
      livresCrees.push(book);
    }

    res.status(201).json({
      success: true,
      message: 'Livres d\'exemple créés avec succès',
      data: livresCrees
    });
  } catch (error) {
    console.error('Erreur lors de la création des livres d\'exemple:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur interne du serveur lors de la création des livres d\'exemple.' 
    });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  getBookPDF,
  createBook,
  updateReadingProgress,
  getReadingStats,
  getGenres,
  createSampleBooks
};