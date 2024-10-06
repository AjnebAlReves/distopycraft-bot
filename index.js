const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const config = require('./data/config');
const discord_player = require('discord-player');
const { getStatusEmbed } = require('./functions/minecraft');
const { time } = require('node:console');

const token = config.bot.token;
require('dotenv').config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions
	],
	partials: [
		Partials.Channel,
		Partials.Message,
		Partials.Reaction,
		Partials.User,
		Partials.GuildMember,
		Partials.GuildScheduledEvent,
		Partials.ThreadMember,
		Partials.Role,
		Partials.GuildScheduledEventUser,
		Partials.GuildPreview,
		Partials.Webhook,
		Partials.Invite,
		Partials.StageInstance,
		Partials.GuildVoiceStates,
	],
	allowedMentions: {
		parse: ['users', 'roles'],
		repliedUser: true
	}
});
const player = new discord_player.Player(client);
client.player = player;

player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor');

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
			console.log(`[INFO] Comando registrado: ${command.data.name}`);
		} else if ('execute' in command) {
			client.commands.set(command.name, command);
			console.log(`[INFO] Comando registrado: ${command.name}`);
		} else {
			console.log(`[WARN] Al comando ubicado en ${filePath} le falta una propiedad requerida "data" o "execute". Sin una de ellas, el comando no se podrá ejecutar`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events/discord');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
client.login(token);

//Función que revisa el estado del servidor cada 2 minutos y actualiza un embed
async function updateStatusEmbed() {
	console.log('[INFO] Starting status embed update process');

	// Load the status database
	const statusDB = require('./data/database/mc_status.json');
	console.log('[INFO] Status database loaded');

	// Create an empty embed object (to be filled later)
	const embed = {};
	console.log('[INFO] Empty embed object created');

	// Fetch the status channel
	const channel = await client.channels.fetch(config.bot.channels.status);
	console.log(`[INFO] Status channel fetched: ${channel.name}`);

	// Get the status message ID from the database
	const statusMessageId = statusDB.message;
	if (!statusMessageId || statusMessageId === '' || statusMessageId === null || statusMessageId === undefined) {
		console.log('[ERROR] Status message ID not found in the database');
	} else {
		console.log(`[INFO] Status message ID retrieved from database: ${statusMessageId}`);
	}

	let message;

	try {
		// Try to fetch the existing message
		message = await channel.messages.fetch(statusMessageId);
		console.log('[INFO] Existing status message found');
	} catch (error) {
		console.log('[INFO] Existing status message not found, creating a new one');
		
		// If the message doesn't exist, create a new one
		const newStatusMessage = await channel.send({ embeds: [embed] });
		console.log(`[INFO] New status message created with ID: ${newStatusMessage.id}`);

		// Update the database with the new message ID
		statusDB.message = newStatusMessage.id;
		fs.writeFileSync('./data/database/mc_status.json', JSON.stringify(statusDB, null, 2));
		console.log('[INFO] Database updated with new message ID');

		message = newStatusMessage;
	}

	// Update the existing message with the new embed
	await message.edit({ embeds: [embed] });
	console.log('[INFO] Status message updated with new embed');

	// Prepare data to be written to the database
	const toJSONDB = {
		timestamp: Math.floor(new Date().getTime() / 1000),
		message: statusDB.message,
		status: false,
		players: {
			online: "N/A",
			max: "N/A"
		}
	};
	console.log('[INFO] Prepared data for database update');

	// Write the updated data to the database
	fs.writeFileSync('./data/database/mc_status.json', JSON.stringify(toJSONDB, null, 2));
	console.log('[INFO] Database updated with latest status information');

	console.log('[INFO] Status embed update process completed');
}

setInterval(updateStatusEmbed, 1000 * 30);