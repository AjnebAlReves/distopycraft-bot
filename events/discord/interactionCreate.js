const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`[ERR] No se encuentra un comando con el nombre de ${interaction.commandName}.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`[ERR] Hubo un error al ejecutar el comando ${interaction.commandName}:`);
			console.error(error);
			interaction.reply({ content: 'Hubo un error al ejecutar este comando.', ephemeral: true });
		}
		if (interaction.isButton()) {
			const button = interaction.client.buttons.get(interaction.customId);
			if (button.name === 'sug_positive') {
				interaction.reply({ content: '¡Gracias por votar por la sugerencia!', ephemeral: true });
				
			}
		}
	},
};