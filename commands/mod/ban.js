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
  const targetUser = interaction.options.getUser("target");
  const banDuration = interaction.options.getInteger("duration");
  const isBannable = interaction.guild.members.cache.get(targetUser.id).bannable;
  const banReason = interaction.options.getString("reason") || "No hay razón";
  const isSilent = interaction.options.getBoolean("silent") || true;
  const executor = interaction.user;

  const banEmbed = new EmbedBuilder()
    .setTitle("Baneo")
    .setColor("#ff0000")
    .setAuthor({ name: executor.tag, iconURL: executor.displayAvatarURL() })
    .setThumbnail(targetUser.displayAvatarURL())
    .setDescription(`**Usuario Baneado:** ${targetUser.tag} (${targetUser.id})\n**Razón:** ${banReason}\n**Duración:** ${formatDuration(banDuration)}`);

  function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours} hora${hours > 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minuto${minutes > 1 ? 's' : ''}`);
    if (remainingSeconds > 0) parts.push(`${remainingSeconds} segundo${remainingSeconds > 1 ? 's' : ''}`);

    return parts.join(', ');
  }

  if (isBannable) {
    const banOptions = { reason: banReason };
    if (banDuration !== 0) {
      banOptions.days = banDuration;
    }
    await interaction.guild.members.ban(targetUser, banOptions);
    await interaction.reply({ embeds: [banEmbed], ephemeral: isSilent });
  } else {
    await interaction.reply({ content: "No puedo banear a este usuario!", ephemeral: true });
  }
}
}