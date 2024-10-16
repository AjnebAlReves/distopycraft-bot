const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getStatus } = require('../../functions/minecraft');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('estado')
        .setDescription('Proporciona información sobre el estado del servidor de Minecraft.'),
    async execute(interaction) {
        await interaction.reply("🔎 Procesando...")
        const status = await getStatus();
        const embed = new EmbedBuilder()
        .setColor('DarkRed')
        .setAuthor({ name: "DistopyCraft | Server Status", iconURL: interaction.client.user.displayAvatarURL() })
        .setTitle(`Estado del servidor`)
        .setDescription(`> **Estado:** ${status.proxy.online ? 'Encendido' : 'Apagado'}\n> **Jugadores:** ${status.proxy.players.online}/500\n> **Versión:** 1.17 - 1.21.1`)
        .setImage(`https://api.mcstatus.io/v2/widget/java/mc.distopycraft.com?${Math.random() * 10000000}`)
        .setFooter({ text: `DistopyCraft - Solicitado por ${interaction.user.username} a las`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();
        await interaction.editReply({
            content: ` `,
            embeds: [embed]
        });
    },    
};