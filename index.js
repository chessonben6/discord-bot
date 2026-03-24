const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('alive');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Web server running on ${PORT}`);
});

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
console.log('Command files found:', commandFiles);

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log('Loaded command:', command.name);
}

client.once('clientReady', () => {
    console.log(`Bot is online as ${client.user.tag}`);
});

client.on('messageCreate', message => {
    console.log('Message seen:', message.content);
    console.log('From bot?:', message.author.bot);

    if (message.author.bot) return;
    if (!message.content.startsWith('!')) return;

    const args = message.content.slice(1).split(/ +/);
    const commandName = args.shift().toLowerCase();

    console.log('Command name:', commandName);

    const command = client.commands.get(commandName);

    if (!command) {
        console.log('Command not found');
        return;
    }

    console.log('Running command:', command.name);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error('Command error:', error);
    }
});

client.login(process.env.TOKEN);
