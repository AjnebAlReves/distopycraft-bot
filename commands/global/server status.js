const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getStatusEmbed } = require('../../functions/minecraft');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('estado')
        .setDescription('Proporciona información sobre el estado del servidor de Minecraft.'),
    async execute(interaction) {
        await interaction.reply("🔎 Procesando...")
        const embed = await getStatusEmbed();
        await interaction.editReply({
            embeds: [embed] 
        });
    },    
};