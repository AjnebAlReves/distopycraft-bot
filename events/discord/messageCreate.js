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

		// Comandos simples para todos los canales
		if (messageContent.includes("!ip" || "!server" || "!mc")) {
			message.reply("¡Bienvenido a DistopyCraft Network! La IP es `mc.distopycraft.com`");
		} else if (messageContent.includes("!rules")) {
			message.reply(`¡Bienvenid@ a DistopyCraft, <@${authorId}>! Las reglas del servidor las encuentras en <#${config.bot.channels.rules}>`);
			/*} else if(messageContent.includes("!log")) {
				args =  messageContent.split(" ");
				console.log(args[1]);*/
			//Mensajes en el canal de IA

		} else if (messageChannel === config.bot.channels.ai) {
			const prompt = messageContent;
			message.channel.sendTyping();
			const text = await generateAIResponse(prompt, messageAuthor.id);
			message.reply(text);
		} else if (messageChannel === config.bot.channels.suggestions) {
			const author = messageAuthor;
			const channel = message.channel;
			const sugg_db = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/sgs.json')));
			const sugg_id = sugg_db.length;
			const sugg_obj = JSON.stringify({
				id: sugg_id,
				message_id: message.id,
				content: messageContent,
				author: author.id,
				votes: {
					upvotes: 0,
					downvotes: 0
				}
			});
			sugg_db.push(sugg_obj);
			fs.writeFileSync(path.join(__dirname, '../../data/sgs.json'), JSON.stringify(sugg_db, null, 2));
			const embed = new EmbedBuilder()
				.setColor(0xff0000)
				.setTitle(`Nueva sugerencia de ${author.username}`)
				.setDescription(messageContent)
				.setTimestamp()
				.setThumbnail(author.displayAvatarURL());
			message.delete();
			if (sugg_db.length > 0) {
				sugg_db.push(sugg_obj);
			} else {
				sugg_db.push(sugg_obj);
			}
			const message = channel.send({ embeds: [embed] });
			message.then(message => {
				message.react('👍');
				message.react('👎');
			});
		} else {
			const textCommandsPath = path.join(__dirname, '../../text-commands');
			const textCommandFiles = fs.readdirSync(textCommandsPath).filter(file => file.endsWith('.js'));
			
			for (const file of textCommandFiles) {
				const command = require(path.join(textCommandsPath, file));
				if (messageContent.toLowerCase().startsWith('!' + command.name) || (command.aliases && command.aliases.some(alias => messageContent.toLowerCase().startsWith('!' + alias)))) {
					command.execute(message);
					return;
				}
			}
		}
	}};