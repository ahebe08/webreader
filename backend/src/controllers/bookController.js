const Book = require('../models/Book');
const path = require('path');
const fs = require('fs');

const getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const result = await Book.findAll(page, limit, search);

    res.json({
      success: true,
      data: result.books,
      pagination: {
        page: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
        hasNext: page < result.totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ error: 'Internal server error while fetching books' });
  }
};

const getBookById = async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Get reading session if user is authenticated
    let readingSession = null;
    if (req.userId) {
      readingSession = await Book.getReadingSession(req.userId, bookId);
    }

    res.json({
      success: true,
      data: {
        ...book,
        readingSession
      }
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ error: 'Internal server error while fetching book' });
  }
};

const getBookPDF = async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (!book.pdf_path) {
      return res.status(404).json({ error: 'PDF not available for this book' });
    }

    const pdfPath = path.join(__dirname, '../../uploads', book.pdf_path);
    
    // Check if file exists
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ error: 'PDF file not found' });
    }

    // Set headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${book.title}.pdf"`);

    // Stream the PDF file
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Get PDF error:', error);
    res.status(500).json({ error: 'Internal server error while fetching PDF' });
  }
};

const updateReadingProgress = async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const { lastPage, progress } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const readingSession = await Book.updateReadingSession(
      req.userId, 
      bookId, 
      lastPage, 
      progress
    );

    res.json({
      success: true,
      message: 'Reading progress updated',
      data: readingSession
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Internal server error while updating progress' });
  }
};

// Sample data for testing
const createSampleBooks = async (req, res) => {
  try {
    const sampleBooks = [
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        year: 1925,
        description: "A classic novel of the Jazz Age, telling the story of the mysterious millionaire Jay Gatsby and his obsession with the beautiful Daisy Buchanan.",
        genre: "Classic",
        publisher: "Scribner",
        isbn: "9780743273565",
        page_count: 180,
        cover_image: "great-gatsby.jpg",
        pdf_path: "sample1.pdf"
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        year: 1960,
        description: "A gripping story of racial injustice and childhood innocence in the American South.",
        genre: "Fiction",
        publisher: "J.B. Lippincott & Co.",
        isbn: "9780061120084",
        page_count: 281,
        cover_image: "mockingbird.jpg",
        pdf_path: "sample2.pdf"
      },
      {
        title: "1984",
        author: "George Orwell",
        year: 1949,
        description: "A dystopian social science fiction novel that examines the consequences of totalitarianism.",
        genre: "Science Fiction",
        publisher: "Secker & Warburg",
        isbn: "9780451524935",
        page_count: 328,
        cover_image: "1984.jpg",
        pdf_path: "sample3.pdf"
      }
    ];

    const createdBooks = [];
    for (const bookData of sampleBooks) {
      const book = await Book.create(bookData);
      createdBooks.push(book);
    }

    res.status(201).json({
      success: true,
      message: 'Sample books created successfully',
      data: createdBooks
    });
  } catch (error) {
    console.error('Create sample books error:', error);
    res.status(500).json({ error: 'Internal server error while creating sample books' });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  getBookPDF,
  updateReadingProgress,
  createSampleBooks
};