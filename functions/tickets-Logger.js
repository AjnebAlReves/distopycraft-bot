const { messageLink } = require('discord.js');
const fs = require('fs');
const path = require('path');

async function logTicket(message) {
    const logPath = path.join(__dirname, '..', '..', 'logs', 'tickets.log');
    const date = new Date();
    if (message.author.id === message.client.user.id) {
        return logEntry = `${date.toISOString()} - ${message.id} - BOT/AI - ${message.content}`;
    } else {
        return logEntry = `${date.toISOString()} - ${message.id} - ${message.author.tag} - ${message.content}`;
    }
    fs.appendFile(logPath, logEntry + '\n', (err) => {
        if (err) {
            console.error(err);
        }
    });
}