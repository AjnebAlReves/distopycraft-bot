const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { sendRCONCommand } = require('../../functions/minecraft');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('rcon')
        .setDescription('Ejecuta comandos RCON en el servidor de juego.')
        .addStringOption(option => option
            .setName('command')
            .setDescription('El comando RCON a ejecutar')
            .setRequired(true))
        .addStringOption(option => option
            .setName('server')
            .setDescription('El servidor de juego al que se enviará el comando RCON')
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        command = interaction.options.getString('command');
        server = interaction.options.getString('server');
        const response = await sendRCONCommand(command, server);
        let embed;
        if (response) {
            embed = new EmbedBuilder()
                .setColor('DarkRed')
                .setAuthor({ name: command, iconURL: 'https://cdn.discordapp.com/attachments/1080801759475949598/1080801760980176906/rcon.png' })
                .setTitle(`Respuesta del servidor:`)
                .addFields({ name: `Respuesta desde ${server}`, value: response });
        } else {
            embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setAuthor({ name: command, iconURL: 'https://cdn.discordapp.com/attachments/1080801759475949598/1080801760980176906/rcon.png' })
                .setTitle(`Respuesta del servidor:`)
                .setDescription('> Mensaje enviado, pero no se recibió respuesta del servidor.');
        }

        interaction.reply({
            embeds: [embed],
            ephemeral: true
         });
    }
};
