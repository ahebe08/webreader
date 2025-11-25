const { pool } = require('../config/database');

class Book {
  static async findAll(page = 1, limit = 10, search = '', genre = '') {
    const offset = (page - 1) * limit;
    let query = `
      SELECT id, title, author, year, description, genre, publisher, 
             page_count, cover_image, created_at, language
      FROM books 
      WHERE 1=1
    `;
    let countQuery = 'SELECT COUNT(*) FROM books WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (search) {
      query += ` AND (title ILIKE $${paramCount} OR author ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      countQuery += ` AND (title ILIKE $${paramCount} OR author ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    if (genre) {
      query += ` AND genre ILIKE $${paramCount}`;
      countQuery += ` AND genre ILIKE $${paramCount}`;
      params.push(`%${genre}%`);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const [booksResult, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, search || genre ? params.slice(0, -2) : [])
    ]);

    return {
      livres: booksResult.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    };
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT id, title, author, year, description, genre, publisher, 
              isbn, page_count, cover_image, pdf_path, file_size, language,
              created_at, updated_at
       FROM books WHERE id = $1`,
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
      pdf_path,
      file_size,
      language = 'fr'
    } = bookData;

    const result = await pool.query(
      `INSERT INTO books 
       (title, author, year, description, genre, publisher, isbn, page_count, 
        cover_image, pdf_path, file_size, language) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING *`,
      [title, author, year, description, genre, publisher, isbn, page_count, 
       cover_image, pdf_path, file_size, language]
    );

    return result.rows[0];
  }

  static async update(id, bookData) {
    const allowedFields = [
      'title', 'author', 'year', 'description', 'genre', 'publisher', 
      'isbn', 'page_count', 'cover_image', 'language'
    ];
    
    const setClause = [];
    const values = [];
    let paramCount = 1;

    allowedFields.forEach(field => {
      if (bookData[field] !== undefined) {
        setClause.push(`${field} = $${paramCount}`);
        values.push(bookData[field]);
        paramCount++;
      }
    });

    if (setClause.length === 0) {
      throw new Error('Aucun champ valide à mettre à jour');
    }

    setClause.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `
      UPDATE books 
      SET ${setClause.join(', ')} 
      WHERE id = $${paramCount} 
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM books WHERE id = $1 RETURNING id',
      [id]
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

  static async getUserReadingStats(userId) {
    const result = await pool.query(
      `SELECT 
        COUNT(DISTINCT book_id) as total_books_read,
        SUM(progress) as total_progress,
        AVG(progress) as average_progress
       FROM reading_sessions 
       WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0];
  }
}

module.exports = Book;