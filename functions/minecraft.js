const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const userDB = require('../data/database/users.json');
const protocol = require('minecraft-protocol');
const util = require('minecraft-server-util');
const { minecraft } = require('../data/config');
const servers = minecraft;
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
                players: {
                    max: null,
                    online: null
                },
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
async function getMainServerPing() {
    const options = {
        timeout: 1000 * 5, // timeout in milliseconds
        enableSRV: true // SRV record lookup
    };
    try {
    const status = await util.status('mc.distopycraft.com', 25565, options);
        response = {
            ping: status.roundTripLatency,
            online: true
        }
    } catch (err) {
        console.error(err);
        response = {
            ping: null,
            online: false
        }
    }
}
module.exports = { getStatus, sendRCONCommand };