const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const ReadingSession = sequelize.define('ReadingSession', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  book_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  last_page: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  progress: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'reading_sessions',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'book_id']
    }
  ]
});

// Méthodes statiques
ReadingSession.getSession = async function(userId, bookId) {
  return await this.findOne({
    where: { user_id: userId, book_id: bookId }
  });
};

ReadingSession.updateSession = async function(userId, bookId, lastPage, progress) {
  const [session, created] = await this.findOrCreate({
    where: { user_id: userId, book_id: bookId },
    defaults: {
      user_id: userId,
      book_id: bookId,
      last_page: lastPage,
      progress: progress
    }
  });

  if (!created) {
    await session.update({
      last_page: lastPage,
      progress: progress,
      updated_at: new Date()
    });
  }

  return session;
};

ReadingSession.getUserStats = async function(userId) {
  const result = await this.findAll({
    where: { user_id: userId },
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('book_id')), 'total_books_read'],
      [sequelize.fn('SUM', sequelize.col('progress')), 'total_progress'],
      [sequelize.fn('AVG', sequelize.col('progress')), 'average_progress']
    ],
    raw: true
  });

  return result[0] || { total_books_read: 0, total_progress: 0, average_progress: 0 };
};

module.exports = ReadingSession;