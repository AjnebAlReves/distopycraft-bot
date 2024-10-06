const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const fs = require("node:fs");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Advierte a un usuario")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Usuario a Advertir")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Razon de la Advertencia")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("silent")
        .setDescription("Silenciar el mensaje de advertencia?")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const warnsDB = require("../../data/database/warns.json");
    const user = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason") || "No hay razon";
    const silent = interaction.options.getBoolean("silent") || false;
    const executor = interaction.user;
    const guild = interaction.guild;

    if (user.id === interaction.user.id) {
      return interaction.reply({
        content: "No puedes advertirte a ti mismo.",
        ephemeral: true,
      });
    } else if (user.id === guild.ownerId) {
      return interaction.reply({
        content: "No puedes advertir al dueño del servidor.",
        ephemeral: true,
      });
    } else if (user.id === interaction.client.user.id) {
      return interaction.reply({
        content: "No puedo advertirme a mi mismo",
        ephemeral: true,
      });
    } else if (user.bot) {
      return interaction.reply({
        content: "No puedo advertir a un bot!",
        ephemeral: true,
      });
    } else if (user.moderable || user.manageable) {
      return interaction.reply({
        content: "No puedo advertir a un usuario moderador.",
        ephemeral: true,
      });
    }
    console.log(`[INFO] Advertencia ejecutada para ${user.tag} por el moderador ${executor.tag}. Motivo: ${reason}`);
    let userWarnData = warnsDB.find(entry => entry.userid === user.id);
    if (!userWarnData) {
      userWarnData = {
        userid: user.id,
        username: user.username,
        warns: []
      };
      warnsDB.push(userWarnData);
    }

    let warnsCount = userWarnData.warns.length;

    // Incrementar el contador de advertencias
    userWarnData.warns.push(reason);

    const modEmbed = new EmbedBuilder()
      .setAuthor({
        name: executor.tag,
        iconURL: executor.displayAvatarURL(),
      })
      .setTitle("Advertencia realizada")
      .setDescription(`**Usuario:** ${user.tag} (${user.id})\n**Razon:** ${reason}\n**Advertencia #${warnsCount + 1}**`)
      .setTimestamp();

    // Agregar la nueva advertencia
    userWarnData.warns.push(reason);
    if (warnsCount >= 5) {
      const banned = new EmbedBuilder()
        .setAuthor({
          name: executor.tag,
          iconURL: executor.displayAvatarURL(),
        })
        .setTitle(`Has sido baneado de ${interaction.guild.name}`)
        .setDescription(`> **Razón:** ${reason}\n> **Advertencias acumuladas:** ${warnsCount}/5`)
        .setFooter({
          text: `Llegaste a la quinta advertencia. Podrás volver al servidor completando una solicitud de desbaneo`,
          iconURL: executor.displayAvatarURL(),
        })
        .setTimestamp();
      
      user.send({ embeds: [banned] });
      interaction.server.ban(user, { reason: `Última Advertencia Alcanzada: ${reason}` });
      interaction.reply({
        embeds: [modEmbed]
      })

    } else {
      // Actualizar el archivo JSON con los datos actualizados
      fs.writeFileSync("data/database/warns.json", JSON.stringify(warnsDB, null, 2));
      interaction.reply({
        embeds: [modEmbed],
        silent: silent
      })
    }
  }
}
