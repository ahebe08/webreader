import React from 'react';
import { Book } from 'lucide-react';

export const BookCard = ({ book, onClick }) => {
  const API_BASE = 'http://localhost:5000';
  
  return (
    <div
      onClick={onClick}
      className="book-card"
    >
      <div className="book-card-cover">
        {book.cover_image ? (
          <img 
            src={`${API_BASE}/uploads/covers/${book.cover_image}`}
            alt={`Couverture de ${book.title}`}
            className="book-cover-image"
            onError={(e) => {
              // Si l'image ne charge pas, afficher l'icône par défaut
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`book-cover-fallback ${book.cover_image ? 'hidden' : ''}`}>
          <Book className="icon-xl" />
        </div>
      </div>
      <div className="book-card-content">
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-author">{book.author}</p>
        <div className="book-card-meta">
          <span>{book.year}</span>
          <span className="book-card-genre">{book.genre}</span>
        </div>
        {book.sessionLecture && (
          <div className="reading-progress-indicator">
            <div 
              className="progress-indicator-bar"
              style={{ width: `${book.sessionLecture.progress || 0}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};