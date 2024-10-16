const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const userDB = require('../data/database/users.json');
const protocol = require('minecraft-protocol');
const util = require('minecraft-server-util');

const servers = {
    proxy: { name: 'Proxy', host: '172.20.0.2', port: 0 },
    lobby_1: { name: 'Lobby #1', host: '172.20.0.3', port: 0, password: process.env.LOBBY_RCON_PASSWORD },
    survival_1: { name: 'Survival 1.20', host: '172.20.0.4', port: 0, password: process.env.SURVIVAL_RCON_PASSWORD },
};

async function getStatus() {
    const options = {
        timeout: 1000 * 5, // timeout in milliseconds
        enableSRV: true // SRV record lookup
    };
    let statusJSON = {};
    for(const server in servers) {        
        try {
            const status = await util.status(servers[server].host, 25565, options);
            statusJSON[server] = {
                ...status,
                online: true
            }
        } catch (err) {
            console.error(err);
            statusJSON[server] = {
                online: false,
                host: null,
                port: null,
                version: null,
                protocol: null,
                players: null,
                description: null,
                favicon: null,
                srvRecord: null,
                roundTripLatency: null
            };
        }
    }
    return statusJSON
}
async function sendRCONCommand(command, server) {
    const { host, password = 'minecraft' } = servers[server.toLowerCase()];
    const rClient = new util.RCON();
    await rClient.connect(host, 25575, { timeout: 5000 });
    await rClient.login(password);
    const response = await rClient.execute(command);
    await rClient.close();
    return response;
}

module.exports = { getStatus, sendRCONCommand };