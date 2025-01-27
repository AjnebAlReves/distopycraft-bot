const { Events } = require("discord.js");
const config = require("../../data/config");

module.exports = {
    name: Events.ChannelCreate,
    once: false,
    async execute(channel) {
        console.log(`[INFO] Canal creado: ${channel.name} en el servidor ${channel.guild.name}. Categoría: ${channel.parent?.name}`);
        if (channel.type === "GUILD_TEXT" && channel.parentId === config.bot.channels.tickets) {
            channel.send(`¡Hola! Gracias por comunicarte con nuestro staff. Por favor, espera a que un miembro del equipo se ponga en contacto contigo. ¡Gracias por tu paciencia!
Mientras esperas, te responderá nuestro ayudante de IA. Sí no quieres que te responda, puedes desactivarlo con el comando ${config.bot.prefix}t-ai off`);

        }
    }
}
