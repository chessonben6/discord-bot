const express = require('express');
const app = express();

// uptime ping server
app.get('/', (req, res) => {
    res.send('alive');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Web server running on port ${PORT}`);
});

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');

// create discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// command storage
client.commands = new Collection();

// load command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
console.log('Command files found:', commandFiles);

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log('Loaded command:', command.name);
}

// bot ready
client.once('clientReady', () => {
    console.log(`Bot is online as ${client.user.tag}`);
});

// message handler
client.on('messageCreate', message => {
    if (message.author.bot) return;
    if (!message.content.startsWith('!')) return;

    const args = message.content.slice(1).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
    }
});

// debug token
console.log('Token exists:', !!process.env.TOKEN);

// login
client.login(process.env.TOKEN);
