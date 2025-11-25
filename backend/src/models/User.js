const { pool } = require('../config/database');

class User {
  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT id, email, created_at, last_login FROM users WHERE id = $1 AND is_active = true',
      [id]
    );
    return result.rows[0];
  }

  static async create(email, passwordHash) {
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, passwordHash]
    );
    return result.rows[0];
  }

  static async updateLastLogin(userId) {
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [userId]
    );
  }

  static async updateProfile(userId, updates) {
    const allowedFields = ['email'];
    const setClause = [];
    const values = [];
    let paramCount = 1;

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        setClause.push(`${field} = $${paramCount}`);
        values.push(updates[field]);
        paramCount++;
      }
    });

    if (setClause.length === 0) {
      throw new Error('Aucun champ valide à mettre à jour');
    }

    values.push(userId);
    const query = `UPDATE users SET ${setClause.join(', ')} WHERE id = $${paramCount} RETURNING id, email, created_at, last_login`;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async deactivate(userId) {
    await pool.query(
      'UPDATE users SET is_active = false WHERE id = $1',
      [userId]
    );
  }
}

module.exports = User;