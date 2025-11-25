import React, { useState } from 'react';
import { Book } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <Book className="auth-logo-icon" />
          <h2 className="auth-logo-text">WebReader</h2>
        </div>
        
        <h3 className="auth-title">Connexion</h3>
        
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}
        
        <div className="auth-form">
          <div className="auth-form-group">
            <label className="auth-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="auth-input"
              placeholder="votre@email.com"
            />
          </div>
          
          <div className="auth-form-group">
            <label className="auth-label">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="auth-input"
              placeholder="••••••••"
            />
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="auth-button"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
        
        <p className="auth-footer">
          Pas encore de compte ?{' '}
          <button
            onClick={onSwitchToRegister}
            className="auth-switch-link"
          >
            Créer un compte
          </button>
        </p>
      </div>
    </div>
  );
};