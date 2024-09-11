const config = require("../../data/config");
const axios = require("axios");
const { Events, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { Welcome } = require("niby-welcomes")

module.exports = {
  name: Events.GuildMemberAdd,
  once: true,
  async execute(member) {
    const messageList = [
      `Bienvenid@ a DistopyCraft, <@${member.user.id}>! Las reglas del servidor las encuentras en <#${config.bot.channels.rules}>`,
      `¡Bienvenid@ a DistopyCraft, <@${member.user.id}>! La IP es mc.distopycraft.com`,
      `¡Bienvenid@ a DistopyCraft, <@${member.user.id}>! Por favor lee las reglas del servidor antes de hablar en el chat general.`,
      `¡Bienvenid@ a DistopyCraft, <@${member.user.id}>! Si tienes alguna duda, pregunta en el canal de <#${config.bot.channels.general}>`,
      `¡Bienvenid@ a DistopyCraft, <@${member.user.id}>! Si quieres hablar con nuestra IA, pregunta en el canal de <#${config.bot.channels.ai}>`,
      `¡Bienvenid@ a DistopyCraft, <@${member.user.id}>! Si quieres sugerir una mejora, pregunta en el canal de <#${config.bot.channels.suggestions}>`,
      `¡Bienvenid@ a DistopyCraft, <@${member.user.id}>! Si quieres reportar un bug, pregunta en el canal de <#${config.bot.channels.bugs}>`,
      `¡Bienvenid@ a DistopyCraft, <@${member.user.id}>! Si quieres hablar con nuestro staff, pregunta en el canal de <#${config.bot.channels.tickets}>`,
      `¡Bienvenid@ a DistopyCraft, <@${member.user.id}>! Soy un bot equipado con IA. Puedes charlar con el comando /ai o en el canal de <#${config.bot.channels.ai}>`,
      `¡Hola, <@${member.user.id}>! Soy un bot equipado con IA. Puedes charlar con el comando /ai o en el canal de <#${config.bot.channels.ai}>`,
      `¡Hola, <@${member.user.id}>! Ya no tuve ideas para saludar. ¡Bienvenid@ a DistopyCraft!`,
      `¡Bienvenid@ a DistopyCraft, <@${member.user.id}>! Soy un bot Open-Source. Puedes ver mi código en https://github.com/AjnebAlReves/distopycraft-bot`,
      `¡Bienvenid@ a DistopyCraft, <@${member.user.id}>! Los comandos de música no funcionan. Sí sabes programar, puedes contribuir al proyecto en https://github.com/AjnebAlReves/distopycraft-bot`,
      `¡Bienvenid@ a DistopyCraft, <@${member.user.id}>! Sí te gusta el servidor, puedes votar. Usa el comando /vote en el canal de <#${config.bot.channels.commands}>`,
    ];
    let welcomeChannel = member.guild.channels.cache.get(config.bot.channels.welcome);
    let backgroundUrl = "https://i.imgur.com/CgQl2pt.png";
    let avatarUrl = member.user.displayAvatarURL({ format: "png", size: 1024 });

    // Cache the background image
    const imgBuffer = await axios.get(backgroundUrl, { responseType: 'arraybuffer' }, () => {
      let backgroundImageBuffer = Buffer.from(backgroundUrl, 'binary');
      if (backgroundImageBuffer) {
        return backgroundImageBuffer;
      } else {
        return null;
      }
    });
    if (welcomeChannel) {
      //CREACIÓN DE BUFFER DE IMAGEN (BIENVENIDA)
      const welcomeImage = await new Welcome()
        .setWelcomeMessage("BIENVENID@")
        .setUsername(member.user.username)
        .setMemberCount(`Eres el número #${member.guild.memberCount}`)
        .setAvatar(avatarUrl)
        .setBackgroundUrl(imgBuffer)
        .setBorder(true, /*OPCIONAL*/ { color: '#ffffff', size: 20 })
        .setStyle("koya") //koya, mee6
        .build();
    }

    //attachment
    let attachment = new AttachmentBuilder(welcomeImage, { name: "welcome.png" });

    //enviamos el mensaje con la bienvenida
    const serverMembers = member.guild.memberCount;
    const embed = new EmbedBuilder()
      .setTitle("Bienvenido")
      .setDescription(
        `<a:17:1057402422865170602> Contigo somos **${serverMembers} personas**!\n\n<a:14:1057402430347804743> Recuerda invitar a tus amigos al servidor para disfrutar junto a ellos!\n\n👥 Invitado por: ${memberInviter}\n➕ Invitaciones: **${memberInvitedBy.invites}**\n\n**<a:16:1057402424769392650> ¡Disfruta tu estadia!**`
      )
      .setColor("DarkRed")
      .setImage(attachment)
      .setFooter({ text: "DistopyCraft" });

    const channel = member.guild.channels.cache.get(config.bot.channels.welcome);
    const randomMessage = messageList[Math.floor(Math.random() * messageList.length)];
    channel.send({ content: randomMessage, embeds: [embed] });
  },
};