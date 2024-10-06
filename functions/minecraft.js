const { EmbedBuilder } = require('discord.js');
const { minecraft } = require('../data/config');
const axios = require('axios');
const userDB = require('../data/database/users.json');
const protocol = require('minecraft-protocol');
const util = require('minecraft-server-util');

const random = Math.floor(Math.random() * 1000000);

async function getStatus(server) {
    return null;
}

async function getStatusEmbed() {
    const servers = {
        lobby: {
            host: "172.20.0.3",
            port: 25565
        },
        survival: {
            host: "172.20.0.4",
            port: 25565
        }
    }
    const statuses = {};
    for (const server in servers) {
        const serverData = servers[server];
        try {
            const status = await util.status(serverData.host, serverData.port);
            statuses[server] = status;
        } catch (error) {
            statuses[server] = { error: true };
        }
    }
    console.log(statuses);
    const embed = new EmbedBuilder()
        .setColor('DarkRed')
        .setTitle('Estado General del servidor')
        .setThumbnail('https://api.mcstatus.io/v2/icon/mc.distopycraft.com')
        .addFields(
            { name: 'Estado del Lobby', value: `> **Estado:** ${statuses.lobby.error ? '🔴 Apagado' : '🟢 Encendido'}\n> **Jugadores:** ${statuses.lobby.players.online}/${statuses.lobby.players.max}\n> **Versión:** ${statuses.lobby.version}` },
            { name: 'Estado del Survival', value: `> **Estado:** ${statuses.survival.error ? '🔴 Apagado' : '🟢 Encendido'}\n> **Jugadores:** ${statuses.survival.players.online}/${statuses.survival.players.max}\n> **Versión:** ${statuses.survival.version}` }
        )
        .setImage(`https://api.mcstatus.io/v2/widget/java/mc.distopycraft.com?${random}`)
        .setFooter({
            text: 'Distopycraft',
            iconURL: 'https://api.mcstatus.io/v2/icon/mc.distopycraft.com'
        });
    return embed;
}

async function sendRCONCommand(command, server) {
    server = minecraft[server.toLowerCase()];
    server.password = server.password || 'minecraft';
    const rClient = new util.RCON();
    const clientOptions = {
        timeout: 1000 * 5
    }
    await rClient.connect(server.host, 25575, clientOptions);
    await rClient.login(server.password, clientOptions);
    const response = await rClient.execute(command);
    await rClient.close();
    return response;
}

module.exports = {
    getStatusEmbed,
    sendRCONCommand
};