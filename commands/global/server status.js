const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('estado')
        .setDescription('Proporciona información sobre el estado del servidor de Minecraft.'),
    async execute(interaction) {
        const r = await axios.get('https://api.mcstatus.io/v2/status/java/mc.distopycraft.com');
        function evadirCache() {
            const randomNumber = Math.floor(Math.random() * 1000000);
            return randomNumber;
        }
        const data = r.data;
        const embed = new EmbedBuilder()
            .setColor('DarkRed')
            .setTitle('DistopyCraft Network | Estado del servidor')
            .setURL('https://mc.distopycraft.com')
            .setDescription(`**Estado:** ${data.online ? 'Encendido' : 'Apagado'}\n**Jugadores:** ${data.players.online}/${data.players.max}\n**IP DEL SERVIDOR:**\n\`\`\`\nmc.distopycraft.com\n\`\`\``)
            .setImage(`https://api.mcstatus.io/v2/widget/java/mc.distopycraft.com?${evadirCache()}`);

        interaction.reply({ embeds: [embed] })
    }
};