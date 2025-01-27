const config = require("../../data/config");
const axios = require("axios");
const fs = require("fs");
const { Events, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const Canvas = require("canvas");
const path = require("path");
module.exports = {
  name: Events.GuildMemberAdd,
  once: true,
  async execute(member) {
    console.log(`[INFO] ${member.user.username} se ha unido a ${member.guild.name}`);
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

    const welcomeChannel = member.guild.channels.cache.get(config.bot.channels.welcome);
    if (!welcomeChannel) {
      console.error(`El canal de bienvenida no existe para el servidor: ${member.guild.name}`);
      return;
    }    
    const canvas = Canvas.createCanvas(1920, 1080);
    const ctx = canvas.getContext('2d');

    // Background color
    const background = Canvas.loadImage(path.join(__dirname, '..', '..', 'data', 'welcome.png'), {
      width: canvas.width,
      height: canvas.height
  
    });
    background.then(() => {
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    }).catch(err => {
      console.log('oh no!', err)
    })
    // Add text
    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Bienvenido, ${member.user.username}!`, canvas.width / 2.5, canvas.height / 3.5);

    // Add avatar
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 25, 25, 200, 200);
    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'welcome-image.png' });

    const serverMembers = member.guild.memberCount;
    const embed = new EmbedBuilder()
      .setTitle("Bienvenido")
      .setDescription(
        `<a:17:1057402422865170602> Contigo somos **${serverMembers} personas**!\n\n<a:14:1057402430347804743> Recuerda invitar a tus amigos al servidor para disfrutar junto a ellos!\n\n**<a:16:1057402424769392650> ¡Disfruta tu estadia!**`
      )
      .setImage("attachment://welcome-image.png")
      .setColor("DarkRed")
      .setFooter({ text: "DistopyCraft Network | IP: mc.distopycraft.com" });

    const randomMessage = messageList[Math.floor(Math.random() * messageList.length)];
    try {
      await welcomeChannel.send({ content: randomMessage, embeds: [embed] });
      console.log(`Mensaje de bienvenida enviado a ${member.user.username} en ${welcomeChannel.name}`);
    } catch (error) {
      console.error(`Error al enviar el mensaje de bienvenida para ${member.user.username}:`, error);
    }
  }
}