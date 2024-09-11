const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Provee información de lo solicitado.'),
	async execute(interaction) {
		
		const embed = new EmbedBuilder()
		.setColor('Red')
		.setThumbnail(userProfile)
		.setAuthor(interaction.user.tag)
		.set
	}
};