const { Sequelize } = require('sequelize');
const Book = require('../models/Book');
const ReadingSession = require('../models/ReadingSession');
const path = require('path');
const fs = require('fs');

const getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const search = req.query.search || '';
    const genre = req.query.genre || '';

    const result = await Book.findAllBooks(page, limit, search, genre);

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

    let sessionLecture = null;
    if (req.userId) {
      sessionLecture = await ReadingSession.getSession(req.userId, bookId);
    }

    res.json({
      success: true,
      message: 'Livre récupéré avec succès',
      data: {
        ...book.toJSON(),
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
    
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ 
        success: false,
        error: 'Fichier PDF non trouvé sur le serveur.' 
      });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${book.title}.pdf"`);

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

    const book = await Book.createBook(bookData);

    res.status(201).json({
      success: true,
      message: 'Livre créé avec succès',
      data: book
    });
  } catch (error) {
    console.error('Erreur lors de la création du livre:', error);
    
    if (req.file) {
      fs.unlinkSync(path.join('/app/uploads/pdfs', req.file.filename));
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

    const readingSession = await ReadingSession.updateSession(
      req.userId, 
      bookId, 
      lastPage, 
      progress
    );

    res.json({
      success: true,
      message: 'Progression de lecture mise à jour avec succès',
      data: readingSession
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
    const stats = await ReadingSession.getUserStats(req.userId);

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
    const genres = await Book.findAll({
      attributes: ['genre'],
      group: ['genre'],
      where: {
        genre: {
          [Sequelize.Op.ne]: null,
          [Sequelize.Op.ne]: ''
        }
      },
      order: [['genre', 'ASC']],
      raw: true
    });

    const genreList = genres.map(g => g.genre).filter(Boolean);

    res.json({
      success: true,
      message: 'Genres récupérés avec succès',
      data: genreList
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des genres:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur interne du serveur lors de la récupération des genres.' 
    });
  }
};

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
        cover_image: "le-petit-prince.jpg",
        pdf_path: "le-petit-prince.pdf",
        language: "fr"
      },
      {
        title: "L'Étranger",
        author: "Albert Camus",
        year: 1942,
        description: "Roman qui explore l'absurdité de la condition humaine.",
        genre: "Philosophique",
        publisher: "Gallimard",
        isbn: "9782070360021",
        page_count: 185,
        cover_image: "letranger.jpg",
        pdf_path: "letranger.pdf",
        language: "fr"
      }
    ];

    const livresCrees = [];
    for (const bookData of sampleBooks) {
      const book = await Book.createBook(bookData);
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