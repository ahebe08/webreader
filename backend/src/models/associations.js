const User = require('./User');
const Book = require('./Book');
const ReadingSession = require('./ReadingSession');

// Définir les relations
User.hasMany(ReadingSession, { foreignKey: 'user_id', as: 'reading_sessions' });
ReadingSession.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Book.hasMany(ReadingSession, { foreignKey: 'book_id', as: 'reading_sessions' });
ReadingSession.belongsTo(Book, { foreignKey: 'book_id', as: 'book' });

module.exports = {
  User,
  Book,
  ReadingSession
};