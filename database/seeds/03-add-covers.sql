-- Ajouter les couvertures aux livres existants
UPDATE books SET cover_image = 'le-petit-prince.jpg' WHERE id = 1;
UPDATE books SET cover_image = 'letranger.jpg' WHERE id = 2;
UPDATE books SET cover_image = 'les-miserables.jpg' WHERE id = 3;