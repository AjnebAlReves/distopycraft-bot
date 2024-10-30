const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js")
const fs = require("node:fs")
const { exec } = require("node:child_process");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Evalúa código JavaScript")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("Código a evaluar")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const code = interaction.options.getString("code");
    const config = require("../../data/config");
    const minecraft = require("../../functions/minecraft");
    client = interaction.client;

    const guild = interaction.guild;
    const channel = client.channels.cache.get(config.bot.statusChannel);
    const executor = interaction.user;

      if (code.includes("process.exit") ||  code.startsWith("process.") || code.startsWith("fs.") || code.startsWith("child_process.") && executor.id !== "829540683739299882") {
      return interaction.reply({
        content: "No puedes ejecutar comandos de sistema en este servidor.",
        ephemeral: true,
      });
    }
    if (!executor.id === "829540683739299882") {
      return interaction.reply({
        content: "No tienes permisos para ejecutar este comando.",
        ephemeral: true,
      });
    } else {
      try {
        const response = await eval(code)
        const embed = new EmbedBuilder()
          .setColor("Green")
          .setAuthor({
            name: code,
            iconURL: "https://bashlogo.com/img/symbol/png/full_colored_dark.png",
          })
          .setTitle("Resultado de la Ejecución")
          .setDescription(`\`\`\`js\n${response}\`\`\``)
          .setTimestamp();
        interaction.reply({ embeds: [embed] })
      } catch (error) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setAuthor({
            name: code,
            iconURL: "https://bashlogo.com/img/symbol/png/full_colored_dark.png",
          })
          .setTitle("Error de Ejecución")
          .setDescription(`\`\`\`js\n${error}\`\`\``)
          .setTimestamp();
        interaction.reply({ embeds: [embed] })
      };
    }
  }
}