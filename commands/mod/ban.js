const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Banea a un usuario")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Usuario a Banear")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("duration")
        .setDescription("Duración del Baneo (en segundos)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Razon del Baneo")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("silent")
        .setDescription("Silenciar el mensaje de baneo?")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction, guild) {
    const user = interaction.options.getUser("target");
    const duration = interaction.options.getInteger("duration");
    const userIsBannable = interaction.guild.members.cache.get(user.id).bannable;
    const reason = interaction.options.getString("reason") || "No hay razon";
    const silent = interaction.options.getBoolean("silent") || true;
    const executor = interaction.user;

    const banned = new EmbedBuilder()
      .setTitle("Baneo")
      .setColor("#ff0000")
      .setAuthor(executor.tag, executor.displayAvatarURL())
      .setThumbnail(user.displayAvatarURL())
      .setDescription(`**Usuario Baneado:** ${user.tag} (${user.id})\n**Razon:** ${reason}\n**Duracion:** ${humanizeDuration(duration)}`)

    function humanizeDuration(seconds) {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const remainingSeconds = seconds % 60

      let result = []
      if (hours > 0) result.push(`${hours} hora${hours > 1 ? 's' : ''}`)
      if (minutes > 0) result.push(`${minutes} minuto${minutes > 1 ? 's' : ''}`)
      if (remainingSeconds > 0) result.push(`${remainingSeconds} segundo${remainingSeconds > 1 ? 's' : ''}`)

      return result.join(', ')
    }
    if (userIsBannable) {
      if (duration === 0) {
        await interaction.guild.members.ban(user, { reason: reason });
        await interaction.reply({ embeds: [banned], silent: silent });
      } else {
        await interaction.guild.members.ban(user, { reason: reason, days: duration });
        await interaction.reply({ embeds: [banned], silent: silent });
      }
    } else {
      await interaction.reply({ content: "No puedo banear a este usuario!", ephemeral: true });
    }
  }
}