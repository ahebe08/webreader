import React from 'react';
import { X, Book, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BookDetailModal = ({ book, onClose }) => {
  const navigate = useNavigate();
  const API_BASE = 'http://localhost:5000';

  const handleReadBook = () => {
    // Naviguer vers la page de lecture
    navigate(`/reader/${book.id}`);
    onClose(); // Fermer la modale
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{book.title}</h2>
          <button
            onClick={onClose}
            className="modal-close"
          >
            <X className="icon-lg" />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="book-detail-grid">
            <div className="book-cover-section">
              <div className="book-cover-large">
                {book.cover_image ? (
                  <img 
                    src={`${API_BASE}/uploads/covers/${book.cover_image}`}
                    alt={`Couverture de ${book.title}`}
                    className="book-cover-image-large"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`book-cover-fallback-large ${book.cover_image ? 'hidden' : ''}`}>
                  <Book className="icon-xxl" />
                </div>
              </div>
              {book.sessionLecture && (
                <div className="reading-progress">
                  <div className="progress-text">
                    Progression: {Math.round(book.sessionLecture.progress || 0)}%
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${book.sessionLecture.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="book-info-section">
              <div className="detail-section">
                <h3 className="detail-label">Auteur</h3>
                <p className="detail-value">{book.author}</p>
              </div>
              
              <div className="detail-grid">
                <div className="detail-section">
                  <h3 className="detail-label">Année</h3>
                  <p className="detail-value">{book.year}</p>
                </div>
                <div className="detail-section">
                  <h3 className="detail-label">Genre</h3>
                  <p className="detail-value">{book.genre}</p>
                </div>
              </div>
              
              {book.publisher && (
                <div className="detail-section">
                  <h3 className="detail-label">Éditeur</h3>
                  <p className="detail-value">{book.publisher}</p>
                </div>
              )}
              
              {book.page_count && (
                <div className="detail-section">
                  <h3 className="detail-label">Pages</h3>
                  <p className="detail-value">{book.page_count}</p>
                </div>
              )}
              
              {book.language && (
                <div className="detail-section">
                  <h3 className="detail-label">Langue</h3>
                  <p className="detail-value">{book.language.toUpperCase()}</p>
                </div>
              )}
              
              <div className="detail-section">
                <h3 className="detail-label">Description</h3>
                <p className="book-description">
                  {book.description || 'Aucune description disponible.'}
                </p>
              </div>
              
              <button
                onClick={handleReadBook}
                className="btn-read-book"
              >
                <Eye className="icon-md" />
                Lire le livre
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};