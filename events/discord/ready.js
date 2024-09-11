const { Events, ActivityType } = require('discord.js');
const axios = require('axios');
const fs = require('node:fs');
const path = require('node:path');
const config = require('../../data/config.js');
const registered_commands = path.join(__dirname, '../../data/commands.json');
const token = config.bot.token;
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    const clientId = client.user.id;
    const rest = new REST().setToken(token);

    console.log(`[INFO] Sesión iniciada como ${client.user.tag}`);

    const commands = [];
    const foldersPath = path.join(__dirname, '../../commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
      const commandsPath = path.join(foldersPath, folder);
      const commandFiles = fs.readdirSync(commandsPath)
        .filter(file => file.endsWith('.js'));

      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
          const commandData = command.data.toJSON();
          commands.push(commandData);
        } else {
          console.log(`[WARN] El comando en ${file} no tiene una propiedad "data" o "execute".`);
        }
      }
    }

    const registeredCommands = commands.map(cmd => ({
      name: cmd.name,
      description: cmd.description,
      options: cmd.options
    }));
    
    let previousCommands = [];
    if (fs.existsSync(registered_commands)) {
      previousCommands = JSON.parse(fs.readFileSync(registered_commands, 'utf8'));
    }

    const commandsChanged = JSON.stringify(registeredCommands) !== JSON.stringify(previousCommands);

    if (commandsChanged) {
      fs.writeFileSync(registered_commands, JSON.stringify(registeredCommands, null, 2));
      console.log('[INFO] Comandos registrados guardados.');

      (async () => {
        try {
          console.log(`[INFO] Recargando ${commands.length} comandos (/) globales.`);

          const data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
          );

          console.log(`[INFO] Se actualizaron ${data.length} comandos (/) globales.`);
        } catch (error) {
          console.error(error);
        }
      })();
    } else {
      console.log('[INFO] No se detectaron cambios en los comandos. No se actualizarán los comandos globales.');
    }

    client.user.setPresence({
      name: "DistopyCraft Network",
      type: ActivityType.Idle,
      url: "https://kick.com/eldrodi"
    });

    var servers = 0;
    //Check if the bot is in some servers, if not, send a link to add the bot to a server
    client.guilds.cache.forEach((guild) => {
      servers++;
    });
    if (servers == 0) {
      console.log(`[INFO] El bot no esta en ningun servidor, presiona el link para añadirlo a un servidor: https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
    } else {
      console.log(`[INFO] El bot esta en ${servers} servidores`)
    }
    
  }
};