const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  last_login: {
    type: DataTypes.DATE
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'users',
  timestamps: false,
  underscored: true
});

// Méthodes statiques - CORRECTION ICI
User.findByEmail = async function(email) {
  return await this.findOne({ 
    where: { email }
  });
};

User.findById = async function(id) {
  return await this.findByPk(id, {
    attributes: ['id', 'email', 'created_at', 'last_login']
  });
};

// CORRECTION CRITIQUE : Utiliser create() avec les bons noms de colonnes
User.createUser = async function(email, passwordHash) {
  return await this.create({
    email: email,
    password_hash: passwordHash
  });
};

User.updateLastLogin = async function(userId) {
  return await this.update(
    { last_login: new Date() },
    { where: { id: userId } }
  );
};

module.exports = User;