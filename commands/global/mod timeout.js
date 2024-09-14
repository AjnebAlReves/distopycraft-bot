const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Aisla temporalmente a un usuario')
        .addUserOption(option => option
            .setName('target')
            .setDescription('Usuario a Aislar')
            .setRequired(true))
        .addStringOption(option => option
            .setName('duration')
            .setDescription('Duracion del Aislamiento. Ejemplo: 1d1h10m30s')
            .setRequired(true))
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Razon del Aislamiento')
            .setRequired(false))
        .addBooleanOption(option => option
            .setName('silent')
            .setDescription('Silenciar el mensaje de aislamiento?')
            .setRequired(false)),

    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No se especifico ninguna razon';
        const durationString = interaction.options.getString('duration');
        const silent = interaction.options.getBoolean('silent') || true;
        const executor = interaction.user;

        const duration = parseDuration(durationString);

        if (duration < 30 || duration > 60 * 60 * 24 * 30 * 12) {
            return interaction.reply({ content: `La duracion debe estar entre 30 segundos y 1 año.` });
        } else {
            return target.disableCommunicationUntil(Date.now() + duration * 1000, reason)
        }
    }
}

function parseDuration(durationString) {
    const regex = /(\d+)([hms])/g;
    let totalSeconds = 0;
    let match;

    while ((match = regex.exec(durationString)) !== null) {
        const value = parseInt(match[1]);
        const unit = match[2];

        switch (unit) {
            case 'h':
                totalSeconds += value * 3600;
                break;
            case 'm':
                totalSeconds += value * 60;
                break;
            case 's':
                totalSeconds += value;
                break;
        }
        return totalSeconds;
    }
}