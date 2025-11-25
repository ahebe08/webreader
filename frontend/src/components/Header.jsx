import React from 'react';
import { Book, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-container container">
        <div className="header-logo">
          <Book className="icon-lg" />
          <h1>WebReader</h1>
        </div>
        {user && (
          <div className="header-user">
            <div className="header-user-info">
              <User className="icon-md" />
              <span>{user.email}</span>
            </div>
            <button
              onClick={logout}
              className="btn-logout"
            >
              <LogOut className="icon-md" />
              <span>Déconnexion</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};