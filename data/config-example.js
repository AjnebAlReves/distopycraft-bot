require('dotenv').config();
module.exports = {
    bot: {
        token: process.env.BOT_TOKEN,
        owners: ["000000000000000000"],
        status: {
            autoChangeTime: 15, //segundos
            presences: [
                /*
                {
                    name: ":)",
                    type: "0", //0 = playing, 1 = streaming, 2 = listening, 3 = watching, 4 = competing
                    url: "https://twitch.tv/elDrodi_09"
                },
                */
                {
                    name: "DistopyCraft Network",
                    type: "streaming",
                    url: "https://twitch.tv/ajnebalreves"
                },
                {
                    name: "tus sugerencias",
                    type: "listening",
                    url: "https://twitch.tv/ajnebalreves"
                },
                {
                    name: "a mc.distopycraft.com",
                    type: "playing",
                    url: "https://twitch.tv/ajnebalreves"
                },
                {
                    name: "con %server_online% jugadores",
                    type: "playing",
                    url: "https://twitch.tv/ajnebalreves"
                },
                {
                    name: "%tickets_open% tickets abiertos",
                    type: "watching",
                    url: "https://twitch.tv/ajnebalreves"
                },
            ]
        },
        channels: {
            ai: "000000", // Canal de la IA
            status: "000000", // Canal de status
            logs: "000000", // Canal de logs
            welcome: "000000", // Canal de bienvenida
            suggestions: "000000", // Canal de sugerencias
            rules: "000000", // Canal de reglas
            general: "000000", // Canal general
            bugs: "000000", // Canal de bugs
            tickets: "000000", // Canal de tickets
            commands: "000000", // Canal de comandos        
        },

    },
    apis: {
        links: {
            mainApi: "https://example.com/api/",
        },
        tokens: {
            mainApi: "" || process.env.MAIN_API_TOKEN,
            aiApi: "" || process.env.AI_TOKEN,
        },
        aiPrompt: "Eres un miembro del staff de un servidor de Minecraft. Solo puedes leer y responder mensajes relacionados exclusivamente a Minecraft en el chat general del Discord de este servidor. Tienes conocimientos sobre SlimeFun, un plugin que usamos en la modalidad de Survival y SkyBlock. No respondas a preguntas sobre otros servidores, juegos o temas no relacionados con Minecraft bajo ninguna circunstancia. El nombre del servidor es %Server_name% y la IP es mc.distopycraft.com. El usuario <@%message_author%> dijo en el chat principal: %prompt%."
    },
    minecraft: {
        main: 'mc.distopycraft.com', //Used for Discord Embed Widget
        server: {
            host: "mc.distopycraft.com",
            port: 25575, //Used for RCON
            password: "" || process.env.SKYBLOCK_RCON_PASSWORD
        }
    }
}