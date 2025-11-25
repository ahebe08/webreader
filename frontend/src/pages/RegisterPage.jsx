import React, { useState } from 'react';
import { Book, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation côté client
    if (!email || !password || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }
    
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await register(email, password);
      if (!result.success) {
        setError(result.error || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      console.error('Erreur détaillée:', err);
      setError('Erreur de connexion au serveur: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const goToLogin = () => {
    navigate('/login');
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
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="auth-input"
              placeholder="votre@email.com"
              disabled={loading}
              required
            />
          </div>
          
          <div className="auth-form-group password-input-container">
            <label className="auth-label">Mot de passe</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="auth-input password-input"
                placeholder="••••••••"
                disabled={loading}
                minLength="6"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={togglePasswordVisibility}
                disabled={loading}
              >
                {showPassword ? <EyeOff className="icon-sm" /> : <Eye className="icon-sm" />}
              </button>
            </div>
            <small className="password-hint">Minimum 6 caractères</small>
          </div>
          
          <div className="auth-form-group password-input-container">
            <label className="auth-label">Confirmer le mot de passe</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="auth-input password-input"
                placeholder="••••••••"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={toggleConfirmPasswordVisibility}
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff className="icon-sm" /> : <Eye className="icon-sm" />}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>
        
        <p className="auth-footer">
          Déjà un compte ?{' '}
          <button
            onClick={goToLogin}
            className="auth-switch-link"
            disabled={loading}
          >
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
};