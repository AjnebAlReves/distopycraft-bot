const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const userDB = require('../db/user.json');
const minecraftProtocol = require('minecraft-protocol');

async function getStatus(server) {
    const servers = {
        proxy: "172.20.0.2",
        lobby: "172.20.0.3",
        survival: "172.20.0.4"
    }
    if (!servers[server]) {
        return { error: 'Servidor no encontrado' };
    } else if (!server) {
        for (const server in servers) {
            const response = await minecraftProtocol.ping(servers[server]);
            return response;
        }
    }
    const response = await minecraftProtocol.ping('172.20.0.2');
    return response;
}
async function getStatusEmbed() {
    const status = await getStatus();
    const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('Estado del servidor')
        .setDescription(`**${status.description}**`)
        .addFields(
            { name: 'Jugadores', value: `**Online:** ${status.players.online}\n**Max:** ${status.players.max}` },
            { name: 'Version', value: `**Version:** ${status.version.name}` },
            { name: 'Mods', value: `**Mods:** ${status.mods.length}` },
            { name: 'MOTD', value: `**MOTD:** ${status.motd}` },
            { name: 'Ping', value: `**Ping:** ${status.ping}` },
            { name: 'Uptime', value: `**Uptime:** ${status.uptime}` },
            { name: 'Players', value: `**Players:** ${status.players.list}` },