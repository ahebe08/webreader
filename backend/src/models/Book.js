const { pool } = require('../config/database');

class Book {
  static async findAll(page = 1, limit = 10, search = '') {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM books';
    let countQuery = 'SELECT COUNT(*) FROM books';
    const params = [];

    if (search) {
      query += ` WHERE title ILIKE $1 OR author ILIKE $1 OR genre ILIKE $1`;
      countQuery += ` WHERE title ILIKE $1 OR author ILIKE $1 OR genre ILIKE $1`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const [booksResult, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, search ? [params[0]] : [])
    ]);

    return {
      books: booksResult.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    };
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM books WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async create(bookData) {
    const {
      title,
      author,
      year,
      description,
      genre,
      publisher,
      isbn,
      page_count,
      cover_image,
      pdf_path
    } = bookData;

    const result = await pool.query(
      `INSERT INTO books 
       (title, author, year, description, genre, publisher, isbn, page_count, cover_image, pdf_path) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [title, author, year, description, genre, publisher, isbn, page_count, cover_image, pdf_path]
    );

    return result.rows[0];
  }

  static async getReadingSession(userId, bookId) {
    const result = await pool.query(
      `SELECT * FROM reading_sessions 
       WHERE user_id = $1 AND book_id = $2`,
      [userId, bookId]
    );
    return result.rows[0];
  }

  static async updateReadingSession(userId, bookId, lastPage, progress) {
    const result = await pool.query(
      `INSERT INTO reading_sessions (user_id, book_id, last_page, progress, updated_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, book_id) 
       DO UPDATE SET last_page = $3, progress = $4, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, bookId, lastPage, progress]
    );
    return result.rows[0];
  }
}

module.exports = Book;