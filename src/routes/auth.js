const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

router.get('/login', (req, res) => res.render('login'));
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findByUsername(username);
  if (user && await bcrypt.compare(password, user.password_hash)) {
    req.session.userId = user.id;
    return res.redirect('/events');
  }
  res.redirect('/login');
});

router.get('/register', (req, res) => res.render('register'));
router.post('/register', async (req, res) => {
    console.log('Form data:', req.body);
    const { username, password, latitude, longitude, categories } = req.body;
    const user = await User.create(username, password, latitude, longitude, categories);
    req.session.userId = user.id;
    res.redirect('/events');
  });

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;