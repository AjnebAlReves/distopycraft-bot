const { SlashCommandBuilder } = require("discord.js");
const OpenAi = require('openai');
const config = require('../../data/config');
const aiFunction = require('../../data/ai');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ai")
        .setDescription("🤖 Habla con la IA de DistopyCraft.")
        .addStringOption((option) => option
            .setName("prompt")
            .setDescription("🤖 Ingresa lo que le quieres preguntar a la IA.")
            .setRequired(true)
        ),

    async execute(interaction, guild) {
        const prompt = interaction.options.getString("prompt");

        await interaction.reply("🔎 Procesando...")
        const response = await aiFunction.generateAIResponse(prompt, interaction.user.id);
        await interaction.editReply(response);
    },
};