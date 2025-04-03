require('dotenv').config();
const express = require('express');
const session = require('express-session');
const i18n = require('i18n');
const db = require('./src/config/db');
const authRoutes = require('./src/routes/auth');
const eventRoutes = require('./src/routes/events');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('src/public'));

i18n.configure({
  locales: ['en', 'es'],
  directory: __dirname + '/src/locales',
  queryParameter: 'lang',
});
app.use(i18n.init);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

const path = require('path');
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

app.use('/', authRoutes);
app.use('/events', eventRoutes);

async function initDb() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(64) UNIQUE NOT NULL,
      password_hash VARCHAR(128) NOT NULL,
      latitude FLOAT,
      longitude FLOAT,
      preferred_categories TEXT
    );
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title VARCHAR(128) NOT NULL,
      description TEXT,
      latitude FLOAT NOT NULL,
      longitude FLOAT NOT NULL,
      date_time TIMESTAMP NOT NULL,
      category VARCHAR(64) NOT NULL,
      user_id INTEGER REFERENCES users(id)
    );
  `);
}

initDb().then(() => {
  app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
});