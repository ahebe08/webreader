import React, { useState, useEffect } from 'react';
import { ArrowLeft, Book } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const ReaderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [book, setBook] = useState(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_BASE = 'http://localhost:5000';

  useEffect(() => {
    const loadBookAndPDF = async () => {
      try {
        // Charger les détails du livre
        const bookResponse = await api.getBook(id);
        if (bookResponse.success) {
          setBook(bookResponse.data);
          
          // Charger le PDF via fetch avec authentification
          const pdfResponse = await fetch(`${API_BASE}/api/books/${id}/pdf`, {
            headers: token ? { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/pdf'
            } : {}
          });
          
          if (pdfResponse.ok) {
            const blob = await pdfResponse.blob();
            const blobUrl = URL.createObjectURL(blob);
            setPdfBlobUrl(blobUrl);
          } else {
            setError('Impossible de charger le PDF');
          }
        } else {
          setError('Livre non trouvé');
        }
      } catch (err) {
        console.error('Erreur:', err);
        setError('Erreur lors du chargement du livre');
      } finally {
        setLoading(false);
      }
    };

    loadBookAndPDF();
  }, [id, token]);

  // Nettoyer l'URL du blob quand le composant est démonté
  useEffect(() => {
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfBlobUrl]);

  const handleBack = () => {
    navigate('/books');
  };

  if (loading) {
    return (
      <div className="reader-page">
        <Header />
        <div className="reader-container">
          <div className="loading-container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loading-text">Chargement du livre...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reader-page">
        <Header />
        <div className="reader-container">
          <div className="error-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="error-text">{error}</div>
            <button onClick={handleBack} className="btn-back">
              <ArrowLeft className="icon-md" />
              Retour à la bibliothèque
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reader-page">
      <Header />
      <div className="reader-container">
        <div className="reader-header">
          <button onClick={handleBack} className="btn-back">
            <ArrowLeft className="icon-md" />
            Retour à la bibliothèque
          </button>
          <h1 className="reader-title">{book?.title}</h1>
          <div className="reader-author">par {book?.author}</div>
        </div>

        <div className="pdf-viewer-full">
          {pdfBlobUrl ? (
            <embed
              src={pdfBlobUrl}
              type="application/pdf"
              width="100%"
              height="100%"
              className="pdf-embed-full"
              style={{ 
                width: '100%', 
                height: '100%', 
                border: 'none',
                flex: 1,
                minHeight: '0'
              }}
            />
          ) : (
            <div className="pdf-error-full">
              <Book className="pdf-error-icon" />
              <p className="pdf-error-text">PDF non disponible</p>
              <button onClick={handleBack} className="btn-back">
                <ArrowLeft className="icon-md" />
                Retour à la bibliothèque
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};