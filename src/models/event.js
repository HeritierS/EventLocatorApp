const db = require('../config/db');

class Event {
  static async create(title, description, latitude, longitude, dateTime, category, userId) {
    const result = await db.query(
      'INSERT INTO events (title, description, latitude, longitude, date_time, category, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, latitude, longitude, dateTime, category, userId]
    );
    return result.rows[0];
  }

  static async findAll() {
    const result = await db.query('SELECT * FROM events');
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM events WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async update(id, updates) {
    const result = await db.query(
      'UPDATE events SET title = $1, description = $2, latitude = $3, longitude = $4, date_time = $5, category = $6 WHERE id = $7 RETURNING *',
      [updates.title, updates.description, updates.latitude, updates.longitude, updates.dateTime, updates.category, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await db.query('DELETE FROM events WHERE id = $1', [id]);
  }
}

module.exports = Event;