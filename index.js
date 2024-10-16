const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');
const config = require('./data/config');
const discord_player = require('discord-player');
const { getStatus } = require('./functions/minecraft');
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

const webStatus = {
	forum: {
		name: 'Foro',
		url: 'https://distopycraft.com',
		online: true
	},
	store: {
		name: 'Tienda',
		url: 'https://tienda.distopycraft.com',
		online: true
	}
};
async function updateStatusEmbed() {
	try {
		console.log('[INFO] Obteniendo el estado del servidor...');
		const status = await getStatus();
		if (!status) {
			console.log('[WARN] No se pudo obtener el estado del servidor');
			return;
		}

		const embed = new EmbedBuilder()
			.setTitle('DistopyCraft')
			.setURL('https://distopycraft.com')
			.setTitle('Estado del servidor')
			.setDescription(`Próxima actualización: <t:${Math.floor(Date.now() / 1000) + 60}:R>\n\n<a:_:1296177196356075682> **Estados de los Servidores [Total: 3]**\n> ${status.proxy.online ? '<a:_:1295838056158462115>' : '<a:_:1296175684208820294>'} **Proxy** (${status.proxy.players.online}/${status.proxy.players.max})\n> ${status.lobby_1.online ? '<a:_:1295838056158462115>' : '<a:_:1296175684208820294>'} **Lobby #1:** (${status.lobby_1.players.online}/${status.lobby_1.players.max})\n> ${status.survival_1.online ? '<a:_:1295838056158462115>' : '<a:_:1296175684208820294>'} **Survival 1.20:** (${status.survival_1.players.online}/${status.survival_1.players.max})\n\n<a:_:1296177196356075682> **Estado de los sitios web [Total: 2]**\n> ${webStatus.forum.online ? '<a:_:1295838056158462115>' : '<a:_:1296175684208820294>'} [**Foro**](https://distopycraft.com)\n> ${webStatus.store.online ? '<a:_:1295838056158462115>' : '<a:_:1296175684208820294>'} [**Tienda**](https://tienda.distopycraft.com)`)
			.setImage(`https://api.mcstatus.io/v2/widget/java/mc.distopycraft.com?${Math.random() * 10000000}`)
			.setFooter({ text: 'DistopyCraft | Se actualiza cada 1 minuto | Última Actualización', iconURL: client.user.displayAvatarURL({ dynamic: true }) })
			.setColor('DarkRed')
			.setTimestamp();

		console.log('[INFO] Obteniendo el canal de estado...');
		const channel = await client.channels.fetch(config.bot.channels.status);
		console.log(`[INFO] Canal de estado obtenido: #${channel.name}`);

		console.log('[INFO] Obteniendo mensajes del canal...');
		const message = await channel.messages.fetch({limit: 3})
			.then(messages => {
				return messages.first();
			})
			.catch(console.error);

		if (!message) {
			console.log('[INFO] No se encontró ningún mensaje del bot en el canal de estado. Creando uno nuevo...');
			channel.send({ embeds: [embed] });
		} else {
			console.log('[INFO] Actualizando el mensaje del bot en el canal de estado...');
			message.edit({ embeds: [embed] });
			console.log('[INFO] Mensaje de estado actualizado.');
		}

	} catch (error) {
		console.error('[ERROR] Error al actualizar el embed de estado:', error);
	}
}

setInterval(updateStatusEmbed, 1000 * 60);