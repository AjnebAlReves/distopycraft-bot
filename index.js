const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const config = require('./data/config');
const discord_player = require('discord-player');

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
	shards: 'auto'
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
/*
// Función para revisar el estado del servidor de Minecraft
async function checkMinecraftServerStatus() {
	try {
		// Aquí debes implementar la lógica para verificar el estado del servidor de Minecraft
		// Por ejemplo, puedes usar una librería como 'minecraft-server-util'
		console.log('[INFO] Revisando el estado del servidor de Minecraft...');
		const r = await axios.get('https://api.mcstatus.io/v2/status/java/mc.distopycraft.com');
		//console.log('[INFO] Respuesta del servidor de Minecraft:', r.data);
		if (r.data.online) {
			console.log('[INFO] El servidor de Minecraft está en línea.');
			// Guardar la respuesta del servidor en un archivo JSON
			const jsonData = JSON.stringify(responseData, null, 2);
			const filePath = path.join(__dirname, './data/mc_status.json');
			fs.writeFileSync(filePath, jsonData);
			const responseData = {
				timestamp: new Date().toISOString(),
				status: r.data.online,
				players: {
					online: r.data.players.online,
					max: r.data.players.max
				}
			};
			const embed = new EmbedBuilder()
				.setColor(0xff0000) // Rojo
				.setTitle('Estado del Servidor de Minecraft')
				.setDescription(`Estado: ${responseData.online}\nJugadores: ${responseData.players.online}/${responseData.players.max}\n**IP DEL SERVIDOR:**\n\`\`\`\nmc.distopycraft.com\n\`\`\``);
			await client.channels.cache.get(config.bot.channels.status).send({ embeds: [embed] });

			console.log('[INFO] Respuesta del servidor guardada en server_status.json');

		} else {
			console.log('[WARN] El servidor de Minecraft está fuera de línea.');

			const responseData = {
				timestamp: new Date().toISOString(),
				status: r.data.online,
				players: {
					online: "Servidor apagado",
					max: " "
				},
				messageId: 0
			};
			const embed = new EmbedBuilder()
				.setColor(0xff0000) // Rojo
				.setTitle('Estado del Servidor de Minecraft')
				.setDescription(`> **Estado:** ${responseData.online}\n> **Jugadores**: ${responseData.players.online}/${responseData.players.max}\n**IP DEL SERVIDOR:**\n\`\`\`\nmc.distopycraft.com\n\`\`\``);
			if (!client.messages.cache.get(jsonData.messageId)) {
				//Obtener ID  del mensaje y guardarlo en el archivo json
				const message = await client.channels.cache.get(config.bot.channels.status).send({ embeds: [embed] });
				responseData.messageId = message.id;
				const jsonData = JSON.stringify(responseData, null, 2);
				const filePath = path.join(__dirname, './data/mc_status.json');
				fs.writeFileSync(filePath, jsonData);
			} else {
				const jsonData = JSON.stringify(responseData, null, 2);
				client.channels.cache.get(config.bot.channels.status).edit(client.messages.cache.get(jsonData.messageId).id, { embeds: [embed] });
				const filePath = path.join(__dirname, './data/mc_status.json');
				fs.writeFileSync(filePath, jsonData);
			}
		}
	} catch (error) {
		console.error('[ERROR] Error al revisar el estado del servidor de Minecraft:', error);
	}
}

// Iniciar un nuevo hilo para revisar constantemente el estado del servidor de Minecraft
setInterval(checkMinecraftServerStatus, 60 * 1000); // Revisar cada 5 minutos
*/