-- Données d'exemple supplémentaires pour le développement
INSERT INTO books (title, author, year, description, genre, publisher, page_count, pdf_path, language) 
SELECT 
    'Le Comte de Monte-Cristo',
    'Alexandre Dumas',
    1844,
    'Roman d''aventures historique racontant l''histoire d''Edmond Dantès, trahi et emprisonné, qui s''évade et se venge sous l''identité du Comte de Monte-Cristo.',
    'Aventure',
    'Pétion',
    1312,
    'monte-cristo.pdf',
    'fr'
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'Le Comte de Monte-Cristo');

INSERT INTO books (title, author, year, description, genre, publisher, page_count, pdf_path, language) 
SELECT 
    'Germinal',
    'Émile Zola',
    1885,
    'Roman naturaliste dépeignant les conditions de vie et de travail des mineurs dans le nord de la France au XIXe siècle.',
    'Naturalisme',
    'G. Charpentier',
    554,
    'germinal.pdf',
    'fr'
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'Germinal');

-- Statistiques de lecture d'exemple
INSERT INTO reading_sessions (user_id, book_id, last_page, progress, updated_at)
SELECT 
    1, 
    id, 
    FLOOR(RANDOM() * page_count) + 1,
    ROUND(RANDOM() * 100, 2),
    CURRENT_TIMESTAMP - (FLOOR(RANDOM() * 30) || ' days')::INTERVAL
FROM books 
WHERE id IN (1, 2, 3)
AND NOT EXISTS (SELECT 1 FROM reading_sessions WHERE user_id = 1 AND book_id = books.id);

RAISE NOTICE '📊 Données d''exemple supplémentaires ajoutées avec succès';