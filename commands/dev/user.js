const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Provee información general del usuario y el servidor actual.'),
	async execute(interaction) {
		const userProfile = interaction.user.displayAvatarURL({ dynamic: true });
		const silent = interaction.options.getBoolean('silent') || true;
		const embed = new EmbedBuilder()
			.setColor('Red')
			.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
			.setAuthor({ name: 'Información del usuario', iconURL: userProfile })
			.setTitle('Información del usuario')
			.addFields(
				{ name: 'Datos del usuario', value: `> Nombre de usuario: ${interaction.user.username}\n> ID: ${interaction.user.id}\n> Fecha de creación: ${interaction.user.createdAt}\n> Fecha de unión: ${interaction.user.joinedAt}` },
				{ name: 'Datos del servidor', value: `> Nombre del servidor: ${interaction.guild.name}\n> ID: ${interaction.guild.id}\n> Fecha de creación: ${interaction.guild.createdAt}` },
				{ name: 'Datos del canal', value: `> Nombre del canal: ${interaction.channel.name}\n> ID: ${interaction.channel.id}\n> Tipo: ${interaction.channel.type}` }
			)
			.setTimestamp()
			.setFooter({ text: 'Bot de prueba', iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
		await interaction.reply({ embeds: [embed]});
	}
};