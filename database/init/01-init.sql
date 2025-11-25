-- Script d'initialisation de la base de données WebReader
-- Version améliorée avec contraintes, index et données en français

DO $$ 
BEGIN
    -- Vérifier si la table books existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'books') THEN
        RAISE NOTICE 'Création des tables...';

        -- Créer la table users avec contraintes améliorées
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
            password_hash VARCHAR(255) NOT NULL CHECK (length(password_hash) >= 60),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP,
            is_active BOOLEAN DEFAULT TRUE,
            CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
        );

        -- Créer la table books avec contraintes améliorées
        CREATE TABLE books (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL CHECK (length(trim(title)) > 0),
            author VARCHAR(255) NOT NULL CHECK (length(trim(author)) > 0),
            year INTEGER CHECK (year >= 0 AND year <= EXTRACT(YEAR FROM CURRENT_DATE)),
            description TEXT,
            genre VARCHAR(100),
            publisher VARCHAR(255),
            isbn VARCHAR(20),
            page_count INTEGER CHECK (page_count > 0),
            cover_image VARCHAR(255),
            pdf_path VARCHAR(255) NOT NULL CHECK (length(trim(pdf_path)) > 0),
            file_size BIGINT,
            language VARCHAR(10) DEFAULT 'fr',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Créer la table reading_sessions avec contraintes
        CREATE TABLE reading_sessions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
            last_page INTEGER DEFAULT 1 CHECK (last_page >= 1),
            progress FLOAT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, book_id)
        );

        -- Créer les index pour les performances
        CREATE INDEX idx_books_title ON books(title);
        CREATE INDEX idx_books_author ON books(author);
        CREATE INDEX idx_books_genre ON books(genre);
        CREATE INDEX idx_books_year ON books(year);
        CREATE INDEX idx_users_email ON users(email);
        CREATE INDEX idx_reading_sessions_user ON reading_sessions(user_id);
        CREATE INDEX idx_reading_sessions_book ON reading_sessions(book_id);
        CREATE INDEX idx_reading_sessions_updated ON reading_sessions(updated_at);

        -- Supprimer les anciens livres
        DELETE FROM books;

        -- Insérer les livres avec les VRAIS fichiers
        INSERT INTO books (title, author, year, description, genre, publisher, page_count, pdf_path, file_size, language) VALUES
        (
            'Le Petit Prince',
            'Antoine de Saint-Exupéry', 
            1943,
            'Conte poétique et philosophique sous l''apparence d''un conte pour enfants.',
            'Classique',
            'Gallimard',
            96,
            'le-petit-prince.pdf',
            1024000,
            'fr'
        ),
        (
            'L''Étranger',
            'Albert Camus',
            1942,
            'Roman qui explore l''absurdité de la condition humaine.',
            'Philosophique',
            'Gallimard',
            185,
            'letranger.pdf',
            850000,
            'fr'
        ),
        (
            'Les Misérables',
            'Victor Hugo',
            1862,
            'Roman historique monumental.',
            'Classique', 
            'A. Lacroix',
            1232,
            'les-miserables.pdf',
            2500000,
            'fr'
        );

        -- Créer un utilisateur de test (mot de passe: "password123")
        INSERT INTO users (email, password_hash) VALUES
        (
            'test@webreader.com', 
            '$2a$12$LQv3c1yqBWVHxkd0g8f7Qu/33A6n6pBdA6u7Vp6R2Q9n9J1ZcXvOa' -- bcrypt hash for "password123"
        );

        RAISE NOTICE 'Base de données initialisée avec succès !';
        RAISE NOTICE '5 livres d''exemple ajoutés';
        RAISE NOTICE 'Utilisateur test: test@webreader.com / password123';
        
    ELSE
        RAISE NOTICE 'Base de données déjà initialisée, aucune action nécessaire';
    END IF;
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Erreur lors de l''initialisation: %', SQLERRM;
        RAISE;
END $$;

-- Vérification des tables créées
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as columns_count
FROM information_schema.tables t 
WHERE table_schema = 'public' 
ORDER BY table_name;