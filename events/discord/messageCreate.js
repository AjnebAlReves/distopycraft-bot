const { Events, EmbedBuilder } = require('discord.js');
const config = require('../../data/config');
const path = require('node:path');
const fs = require('node:fs');
const { generateAIResponse } = require('../../functions/ai');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (message.author.bot) return;
		const messageChannel = message.channel.id;
		const messageContent = message.content;
		const messageAuthor = message.author;
		authorId = messageAuthor.id;
		console.log(`[DEBUG] ${messageAuthor.username} ha enviado un mensaje en el canal ${messageChannel} con el contenido: ${messageContent}`);
		if (messageChannel === config.bot.channels.ai) {
			const prompt = messageContent;
			message.channel.sendTyping();
			const text = await generateAIResponse(prompt, messageAuthor.id);
			message.reply(text);
		} else {
			const textCommandsPath = path.join(__dirname, '../../text-commands');
			const textCommandFiles = fs.readdirSync(textCommandsPath).filter(file => file.endsWith('.js'));

			for (const file of textCommandFiles) {
				const command = require(path.join(textCommandsPath, file));
				if (messageContent.toLowerCase().startsWith(config.bot.prefix + command.name) || (command.aliases && command.aliases.some(alias => messageContent.toLowerCase().startsWith('!' + alias)))) {
					command.execute(message);
					return;
				}
			}
		}
	}
};