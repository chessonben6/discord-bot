const express = require('express');
const app = express();
const { Client, GatewayIntentBits } = require('discord.js');

app.get('/', (req, res) => {
  res.send('alive');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Web server running on port ${PORT}`);
});

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log('BOT ONLINE');
});

client.on('error', error => {
  console.error('CLIENT ERROR:', error);
});

process.on('unhandledRejection', error => {
  console.error('UNHANDLED REJECTION:', error);
});

const token = (process.env.TOKEN || '').trim();

console.log('Starting login...');
client.login(token)
  .then(() => console.log('LOGIN RESOLVED'))
  .catch(error => console.error('LOGIN FAILED:', error));
