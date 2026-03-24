const express = require('express');
const app = express();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');

app.get('/', (req, res) => {
    res.send('alive');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Web server running on port ${PORT}`);
});

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
    if (message.author.bot) return;
    if (!message.content.startsWith('!')) return;

    const args = message.content.slice(1).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    if (!command) return;

    try {
        command.execute(message, args);
    } catch (error) {
        console.error('Command execute error:', error);
    }
});

client.on('warn', info => {
    console.log('Discord warn:', info);
});

client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
});

const token = (process.env.TOKEN || '').trim();

console.log('TOKEN exists:', !!process.env.TOKEN);
console.log('TOKEN trimmed length:', token.length);
console.log('Starting Discord login...');

(async () => {
    try {
        const result = await client.login(token);
        console.log('Login call returned successfully');
        console.log('Returned token length:', result ? result.length : 0);
    } catch (error) {
        console.error('Login failed:', error);
    }
})();
