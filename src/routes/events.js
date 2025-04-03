const express = require('express');
const Event = require('../models/event');
const User = require('../models/user');
const { getDistance } = require('geolib');
const redis = require('redis');

const router = express.Router();
const redisClient = redis.createClient({ url: process.env.REDIS_URL });

router.use(async (req, res, next) => {
  if (!req.session.userId) return res.redirect('/login');
  req.user = await User.findById(req.session.userId);
  next();
});

router.get('/', async (req, res) => {
  const events = await Event.findAll();
  const userLocation = { latitude: req.user.latitude, longitude: req.user.longitude };
  const filteredEvents = events
    .filter(event => {
      const eventLocation = { latitude: event.latitude, longitude: event.longitude };
      const distance = getDistance(userLocation, eventLocation) / 1000; // km
      return distance <= 50; // 50km radius
    })
    .filter(event => req.user.preferred_categories.split(',').includes(event.category));
  
  res.render('events', { events: filteredEvents, user: req.user });
});

router.get('/create', (req, res) => res.render('create-event'));
router.post('/create', async (req, res) => {
  const { title, description, latitude, longitude, dateTime, category } = req.body;
  const event = await Event.create(title, description, latitude, longitude, dateTime, category, req.user.id);
  
  await redisClient.connect();
  await redisClient.publish('event_notifications', JSON.stringify(event));
  await redisClient.disconnect();
  
  res.redirect('/events');
});

router.post('/delete/:id', async (req, res) => {
  await Event.delete(req.params.id);
  res.redirect('/events');
});

module.exports = router;