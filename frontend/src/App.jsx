import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage, RegisterPage, BooksPage } from './pages';

const AuthContent = ({ showLogin, setShowLogin }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return showLogin ? (
      <LoginPage onSwitchToRegister={() => setShowLogin(false)} />
    ) : (
      <RegisterPage onSwitchToLogin={() => setShowLogin(true)} />
    );
  }

  return <BooksPage />;
};

export default function App() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <AuthProvider>
      <AuthContent showLogin={showLogin} setShowLogin={setShowLogin} />
    </AuthProvider>
  );
}