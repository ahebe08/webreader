import React, { useState } from 'react';
import { Book, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error || 'Email ou mot de passe incorrect');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
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

  const goToRegister = () => {
    navigate('/register');
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
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        
        <p className="auth-footer">
          Pas encore de compte ?{' '}
          <button
            onClick={goToRegister}
            className="auth-switch-link"
            disabled={loading}
          >
            Créer un compte
          </button>
        </p>
      </div>
    </div>
  );
};