const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'webreader',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Connexion PostgreSQL établie avec succès');
    
    // Initialiser les tables de la base de données
    await initTables();
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error);
    throw error;
  }
};

const initTables = async () => {
  try {
    // Table des utilisateurs
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      )
    `);

    // Table des livres avec métadonnées améliorées
    await pool.query(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        year INTEGER CHECK (year >= 0 AND year <= EXTRACT(YEAR FROM CURRENT_DATE)),
        description TEXT,
        genre VARCHAR(100),
        publisher VARCHAR(255),
        isbn VARCHAR(20),
        page_count INTEGER CHECK (page_count > 0),
        cover_image VARCHAR(255),
        pdf_path VARCHAR(255) NOT NULL,
        file_size BIGINT,
        language VARCHAR(10) DEFAULT 'fr',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Table des sessions de lecture
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reading_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
        last_page INTEGER DEFAULT 1 CHECK (last_page >= 1),
        progress FLOAT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, book_id)
      )
    `);

    // Créer des index pour de meilleures performances
    await pool.query('CREATE INDEX IF NOT EXISTS idx_books_title ON books(title)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_books_author ON books(author)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_books_genre ON books(genre)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_reading_sessions_user ON reading_sessions(user_id)');

    console.log('✅ Tables de la base de données initialisées avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des tables:', error);
    throw error;
  }
};

module.exports = {
  pool,
  connectDB,
  query: (text, params) => pool.query(text, params)
};