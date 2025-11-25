import React from 'react';
import { Book } from 'lucide-react';

export const BookCard = ({ book, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="book-card"
    >
      <div className="book-card-cover">
        <Book className="icon-xl" />
      </div>
      <div className="book-card-content">
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-author">{book.author}</p>
        <div className="book-card-meta">
          <span>{book.year}</span>
          <span className="book-card-genre">{book.genre}</span>
        </div>
      </div>
    </div>
  );
};