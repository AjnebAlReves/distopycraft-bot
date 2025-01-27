const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Partials, EmbedBuilder, Activity } = require('discord.js');
const config = require('./data/config');
const { getStatus } = require('./functions/minecraft');

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

const textCommandsPath = path.join(__dirname, 'text-commands');
const textCommandFiles = fs.readdirSync(textCommandsPath).filter(file => file.endsWith('.js'));

for (const file of textCommandFiles) {
	const filePath = path.join(textCommandsPath, file);
	const command = require(filePath);
	if ('name' in command && 'execute' in command) {
		client.commands.set(command.name, command);
		console.log(`[INFO] Comando de texto registrado: ${config.bot.prefix}${command.name}`);
	} else {
		console.log(`[WARN] Al comando de texto ubicado en ${filePath} le falta una propiedad requerida "name" o "execute". Sin una de ellas, el comando no se podrá ejecutar`);
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
		online: false
	},
	store: {
		name: 'Tienda',
		url: 'https://tienda.distopycraft.com',
		online: true
	}
};
async function updateStatusEmbed() {
	try {
		const [status, channel] = await Promise.all([
			getStatus(),
			client.channels.fetch(config.bot.channels.status)
		]);

		if (!status || !channel) {
			console.log('[WARN] No se pudo obtener el estado del servidor o el canal de estado');
			return;
		}

		const embed = new EmbedBuilder()
			.setTitle('DistopyCraft')
			.setURL('https://distopycraft.com')
			.setTitle('Estado del servidor')
			.setDescription(`Próxima actualización: <t:${Math.floor(Date.now() / 1000) + 60}:R>
			
			<a:_:1296177196356075682> **Estados de los Servidores [Total: ${Object.keys(status).length - 1}]**
			${Object.entries(status).filter(([name]) => name !== 'main').map(([name, server]) => `> ${server.online ? '<a:_:1295838056158462115>' : '<a:_:1296175684208820294>'} **${name.charAt(0).toUpperCase() + name.slice(1)}:** (${server.players.online}/${server.players.max})`).join('\n')}			
			
			<a:_:1296177196356075682> **Estado de los sitios web [Total: 2]**
			> ${webStatus.forum.online ? '<a:_:1295838056158462115>' : '<a:_:1296175684208820294>'} [**Foro**](https://distopycraft.com)
			> ${webStatus.store.online ? '<a:_:1295838056158462115>' : '<a:_:1296175684208820294>'} [**Tienda**](https://tienda.distopycraft.com)`)
			.setImage(`https://api.mcstatus.io/v2/widget/java/mc.distopycraft.com?${Math.random() * 10000000}`)
			.setFooter({ text: 'DistopyCraft | Se actualiza cada 1 minuto | Última Actualización', iconURL: client.user.displayAvatarURL({ dynamic: true }) })
			.setColor('DarkRed')
			.setTimestamp();

		const message = await channel.messages.fetch({ limit: 3 })
			.then(messages => messages.first())
			.catch(console.error);

		if (!message) {
			await channel.send({ embeds: [embed] });
		} else {
			await message.edit({ embeds: [embed] });
		}

	} catch (error) {
		console.error('[ERROR] Error al actualizar el embed de estado:', error);
	}
}
const status = config.bot.status;
const presences = status.presences;
const ActivityTypes = ['PLAYING', 'STREAMING', 'LISTENING', 'WATCHING', 'COMPETING'];
const ticketsCategory = client.guilds.cache.get(config.bot.guild)?.channels.cache.find(c => c.id === config.bot.channels.tickets && c.type === 4);
if (!ticketsCategory) {
	console.log('[WARN] No se encontró la categoría de tickets');
	return;
}
const ticketsOpen = ticketsCategory.children.cache.size;
let index = 0;

setInterval(() => {
	const presence = presences[index];
	console.log(`[INFO] Cambiando presencia a: [${index}] ${presence.type || 'Indefinido'} - ${presence.name || 'Indefinido'} - ${presence.url || 'Sin URL'}`);
	client.user.setPresence({
		activities: [{
			name: presence.name.replace('%server_online%', '0').replace('%tickets_open%', ticketsOpen),
			type: ActivityTypes[presence.type],
			url: presence.url
		}],
		status: 'idle',
	});

	index = (index + 1) % presences.length;
}, status.autoChangeTime * 1000);
setInterval(updateStatusEmbed, 1000 * 60);