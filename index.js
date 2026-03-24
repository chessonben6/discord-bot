const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`BOT ONLINE: ${client.user.tag}`);
});

client.on('messageCreate', message => {
  console.log('SAW MESSAGE:', message.content);

  if (message.author.bot) return;

  if (message.content === '!ping') {
    message.reply('Pong!');
  }
});

client.login(process.env.TOKEN);
