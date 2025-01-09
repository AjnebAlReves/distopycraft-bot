const { EmbedBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const categories = require('../data/categories.json')

module.exports = {
    name: 'help',
    description: 'Muestra la lista de comandos disponibles',
    category: 'general',
    aliases: ['commands', 'comandos'],
    async execute(message) {
        const embed = new EmbedBuilder()
            .setTitle('Lista de comandos')
            .setDescription('Estos son los comandos disponibles:');

        const commands = fs.readdirSync('./text-commands')
            .filter(file => file.endsWith('.js'))
            .map(file => require(`./${file}`));

        for (const category in categories) {
            const categoryCommands = commands.filter(cmd => cmd.category === category);
            if (categoryCommands.length > 0) {
                embed.addFields({
                    name: `${categories[category]}`,
                    value: categoryCommands.map(cmd => 
                        `**${cmd.aliases ? `!${cmd.name}, !${cmd.aliases.join(', !')}` : `!${cmd.name}`}**
> ${cmd.description}`
                    ).join('\n')
                });
            }
        }

        embed.setFooter({ text: `DistopyCraft Network | Solicitado por: ${message.author.username}`, iconURL: 'https://i.imgur.com/wSTFkRM.png' })
            .setTimestamp();
        return message.channel.send({ embeds: [embed] });
    }
};