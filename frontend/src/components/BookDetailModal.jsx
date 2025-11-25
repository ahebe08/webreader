import React, { useState, useEffect } from 'react';
import { X, Book, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

export const BookDetailModal = ({ book, onClose }) => {
  const { token } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [showReader, setShowReader] = useState(false);

  const handleUpdateProgress = async () => {
    if (!token) return;
    try {
      await api.updateProgress(token, book.id, currentPage, currentPage / 100);
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  useEffect(() => {
    if (showReader) {
      handleUpdateProgress();
    }
  }, [currentPage, showReader]);

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
        
        {!showReader ? (
          <div className="modal-body">
            <div className="book-detail-grid">
              <div className="book-cover-section">
                <div className="book-cover-large">
                  <Book className="icon-xxl" />
                </div>
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
                
                <div className="detail-section">
                  <h3 className="detail-label">Description</h3>
                  <p className="book-description">{book.description}</p>
                </div>
                
                <button
                  onClick={() => setShowReader(true)}
                  className="btn-read-book"
                >
                  <Eye className="icon-md" />
                  Lire le livre
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="modal-body">
            <div className="pdf-reader">
              <Book className="pdf-reader-icon" />
              <p className="pdf-reader-text">Lecteur PDF intégré</p>
              <p className="pdf-reader-page">Page {currentPage} / 100</p>
              
              <div className="page-controls">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="btn-page-nav btn-prev"
                >
                  ← Page précédente
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(100, currentPage + 1))}
                  disabled={currentPage === 100}
                  className="btn-page-nav btn-next"
                >
                  Page suivante →
                </button>
              </div>
              
              <button
                onClick={() => setShowReader(false)}
                className="btn-back-details"
              >
                ← Retour aux détails
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};