const util = require('minecraft-server-util');
const { minecraft } = require('../data/config');
const servers = minecraft;
async function getStatus() {
    const options = {
        timeout: 1000 * 5, // timeout in milliseconds
        enableSRV: true // SRV record lookup
    };
    const promises = Object.keys(servers).map(async (server) => {
        try {
            const status = await util.status(servers[server].host, 25565, options);
            return {
                [server]: {
                    ...status,
                    online: true
                }
            };
        } catch (err) {
            console.error(err);
            return {
                [server]: {
                    online: false,
                    host: null,
                    port: null,
                    version: null,
                    protocol: null,
                    players: {
                        max: 0,
                        online: "Servidor Apagado"
                    },
                    description: null,
                    favicon: null,
                    srvRecord: null,
                    roundTripLatency: null
                }
            };
        }
    });
    const results = await Promise.all(promises);
    const statusJSON = results.reduce((acc, val) => ({ ...acc, ...val }), {});
    return statusJSON;
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
    const server = 'mc.distopycraft.com';
    try {
        const status = await util.status(server, 25565, options);
        return {
            [server]: {
                ping: status.roundTripLatency,
                players: {
                    max: status.players.max,
                    online: status.players.online
                },
                online: true
            }
        };
    } catch (err) {
        console.error(err);
        return {
            [server]: {
                online: false,
                players: {
                    max: 0,
                    online: "Servidor Apagado"
                },
                roundTripLatency: "999+ ms"
            }
        };
    }
}
module.exports = { getStatus, sendRCONCommand };