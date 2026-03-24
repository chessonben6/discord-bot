module.exports = {
    name: 'ping',
    execute(message) {
        console.log('Ping command executed');
        message.reply('Pong!');
    }
};