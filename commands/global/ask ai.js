const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const OpenAi = require('openai');
const config = require('../../data/config');
const aiFunction = require('../../functions/ai');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ai")
        .setDescription("🤖 Habla con la IA de DistopyCraft.")
        .addStringOption((option) => option
            .setName("prompt")
            .setDescription("🤖 Ingresa lo que le quieres preguntar a la IA.")
            .setRequired(true)
        ),

    async execute(interaction) {
        const prompt = interaction.options.getString("prompt");

        await interaction.reply("🔎 Procesando...")
        const response = await aiFunction.generateAIResponse(prompt, interaction.user.id);
        if (!response) return interaction.editReply("🤖 Lo siento, pero no pude generar una respuesta.");
        const embed = new EmbedBuilder()
            .setColor('DarkRed')
            .setAuthor({ name: "DistopyCraft | IA", iconURL: interaction.client.user.displayAvatarURL() })
            .setDescription(response)
            .setFooter({ text: `Distopycraft IA es una IA en fase Beta. Comprueba la información Importante.`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();
        await interaction.editReply({
            content: `<@${interaction.user.id}>`,
            embeds: [embed] 
        });
    },
};