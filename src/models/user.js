const bcrypt = require('bcrypt');
const db = require('../config/db');

class User {
  static async create(username, password, latitude, longitude, preferredCategories) {
    const hashedPassword = await bcrypt.hash(password, 10);
    // Ensure preferredCategories is an array; convert if it’s not
    const categoriesString = Array.isArray(preferredCategories)
      ? preferredCategories.join(',')
      : preferredCategories || ''; // Default to empty string if undefined
    const result = await db.query(
      'INSERT INTO users (username, password_hash, latitude, longitude, preferred_categories) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, latitude, longitude, preferred_categories',
      [username, hashedPassword, latitude, longitude, categoriesString]
    );
    return result.rows[0];
  }

  static async findByUsername(username) {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }
}

module.exports = User;