const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  author: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER
  },
  description: {
    type: DataTypes.TEXT
  },
  genre: {
    type: DataTypes.STRING(100)
  },
  publisher: {
    type: DataTypes.STRING(255)
  },
  isbn: {
    type: DataTypes.STRING(20)
  },
  page_count: {
    type: DataTypes.INTEGER
  },
  cover_image: {
    type: DataTypes.STRING(255)
  },
  pdf_path: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  file_size: {
    type: DataTypes.BIGINT
  },
  language: {
    type: DataTypes.STRING(10),
    defaultValue: 'fr'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'books',
  timestamps: false,
  underscored: true
});

// Méthodes statiques
Book.findAllBooks = async function(page = 1, limit = 10, search = '', genre = '') {
  const offset = (page - 1) * limit;
  
  const where = {};
  
  if (search) {
    where[Sequelize.Op.or] = [
      { title: { [Sequelize.Op.iLike]: `%${search}%` } },
      { author: { [Sequelize.Op.iLike]: `%${search}%` } },
      { description: { [Sequelize.Op.iLike]: `%${search}%` } }
    ];
  }
  
  if (genre) {
    where.genre = { [Sequelize.Op.iLike]: `%${genre}%` };
  }

  const { count, rows } = await this.findAndCountAll({
    where,
    limit,
    offset,
    order: [['created_at', 'DESC']],
    attributes: [
      'id', 'title', 'author', 'year', 'description', 'genre', 
      'publisher', 'page_count', 'cover_image', 'created_at', 'language'
    ]
  });

  return {
    livres: rows,
    total: count,
    page,
    totalPages: Math.ceil(count / limit)
  };
};

Book.findById = async function(id) {
  return await this.findByPk(id);
};

Book.createBook = async function(bookData) {
  return await this.create(bookData);
};

module.exports = Book;