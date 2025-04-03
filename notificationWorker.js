const redis = require('redis');
require('dotenv').config();

const client = redis.createClient({ url: process.env.REDIS_URL });

async function startWorker() {
  await client.connect();
  const subscriber = client.duplicate();
  await subscriber.connect();
  
  subscriber.subscribe('event_notifications', (message) => {
    const event = JSON.parse(message);
    console.log(`New event notification: ${event.title} on ${event.date_time}`);
    // Add email/SMS notification logic here
  });
}

startWorker().catch(console.error);