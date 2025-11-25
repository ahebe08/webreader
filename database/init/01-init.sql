-- Script intelligent qui vérifie si les tables existent déjà

DO $$ 
BEGIN
    -- Vérifier si la table books existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'books') THEN
        -- Créer la table books
        CREATE TABLE books (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            year INTEGER,
            description TEXT,
            genre VARCHAR(100),
            publisher VARCHAR(255),
            isbn VARCHAR(20),
            page_count INTEGER,
            cover_image VARCHAR(255),
            pdf_path VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Créer la table users
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP
        );

        -- Créer la table reading_sessions
        CREATE TABLE reading_sessions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
            last_page INTEGER DEFAULT 1,
            progress FLOAT DEFAULT 0,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, book_id)
        );

        -- Insérer des données de test
        INSERT INTO books (title, author, year, description, genre, page_count) VALUES
        ('The Great Gatsby', 'F. Scott Fitzgerald', 1925, 'A classic novel of the Jazz Age', 'Classic', 180),
        ('To Kill a Mockingbird', 'Harper Lee', 1960, 'A story of racial injustice', 'Fiction', 281),
        ('1984', 'George Orwell', 1949, 'Dystopian novel about totalitarianism', 'Science Fiction', 328);

        RAISE NOTICE '✅ Database tables created and sample data inserted';
    ELSE
        RAISE NOTICE '✅ Database already initialized, skipping creation';
    END IF;
END $$;