import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage, RegisterPage, BooksPage, ReaderPage } from './pages';

const AppContent = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Routes publiques */}
      {!user && (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}

      {/* Routes protégées */}
      {user && (
        <>
          <Route path="/books" element={<BooksPage />} />
          <Route path="/reader/:id" element={<ReaderPage />} />
          <Route path="/" element={<Navigate to="/books" replace />} />
          <Route path="/login" element={<Navigate to="/books" replace />} />
          <Route path="/register" element={<Navigate to="/books" replace />} />
        </>
      )}
    </Routes>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}