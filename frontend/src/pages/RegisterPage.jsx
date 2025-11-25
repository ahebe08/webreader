import React, { useState } from 'react';
import { Book } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const RegisterPage = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    
    if (!email || !password || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    setLoading(true);
    
    try {
      await register(email, password);
    } catch (err) {
      setError('Erreur lors de l\'inscription. L\'email existe peut-être déjà.');
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
        
        <h3 className="auth-title">Créer un compte</h3>
        
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
          
          <div className="auth-form-group">
            <label className="auth-label">Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </div>
        
        <p className="auth-footer">
          Déjà un compte ?{' '}
          <button
            onClick={onSwitchToLogin}
            className="auth-switch-link"
          >
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
};