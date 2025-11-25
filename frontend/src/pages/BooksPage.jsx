import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Header } from '../components/Header';
import { BookCard } from '../components/BookCard';
import { BookDetailModal } from '../components/BookDetailModal';
import { api } from '../services/api';

export const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    api.getBooks()
      .then(data => {
        setBooks(data.books || []);
        setFilteredBooks(data.books || []);
      })
      .catch(err => setError('Erreur lors du chargement des livres'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books);
    }
  }, [searchTerm, books]);

  const handleBookClick = async (bookId) => {
    try {
      const data = await api.getBook(bookId);
      setSelectedBook(data.book);
    } catch (err) {
      console.error('Error fetching book details:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-text">{error}</div>
      </div>
    );
  }

  return (
    <div className="books-page">
      <Header />
      
      <div className="container books-container">
        <div className="books-header">
          <h2 className="books-title">Bibliothèque</h2>
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par titre, auteur ou genre..."
              className="search-input"
            />
          </div>
        </div>
        
        {filteredBooks.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-text">Aucun livre trouvé</p>
          </div>
        ) : (
          <div className="books-grid">
            {filteredBooks.map(book => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => handleBookClick(book.id)}
              />
            ))}
          </div>
        )}
      </div>
      
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
};