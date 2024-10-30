const config = require("../../data/config");
const axios = require("axios");
const { Events, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const Canvas = require("@napi-rs/canvas");
module.exports = {
  name: Events.GuildMemberAdd,
  once: true,
  async execute(member) {
    console.log(`[INFO] ${member.user.username} se ha unido a ${member.guild.name}`);
    const messageList = [
      `¡Qué onda, <@${member.user.id}>! Bienvenido a la fiesta de DistopyCraft. ¡Prepárate para el desmadre pixelado!`,
      `¡Epa, <@${member.user.id}>! Acabas de caer en el agujero de conejo de DistopyCraft. ¡Agárrate que nos vamos!`,
      `¡Yooo, <@${member.user.id}>! Bienvenido al club más cool de Minecraft. Aquí hasta los creepers son hipsters.`,
      `¡Qué pex, <@${member.user.id}>! Bienvenido a DistopyCraft, donde los diamantes son los nuevos likes.`,
      `¡Wasaaa, <@${member.user.id}>! Acabas de entrar al servidor más loco del multiverso Minecraft.`,
      `¡Ey, <@${member.user.id}>! Bienvenido a DistopyCraft. Aquí minamos como pros y construimos como bobos.`,
      `¡Qué tranza, <@${member.user.id}>! Bienvenido al único lugar donde puedes ser un arquitecto, minero y granjero... todo antes del desayuno.`,
      `¡Órale, <@${member.user.id}>! Bienvenido a DistopyCraft, donde los creepers explotan de risa con nuestros chistes malos.`,
      `¡Qué show, <@${member.user.id}>! Acabas de spawnearte en el servidor más chido. ¡No olvides traer tus memes!`,
      `¡Holi boli, <@${member.user.id}>! Bienvenido a DistopyCraft, donde hasta los endermans bailan la macarena.`,
      `¡Qué pachuca por Toluca, <@${member.user.id}>! Bienvenido al único lugar donde puedes construir un castillo de dirt y llamarlo arte moderno.`,
      `¡Eh, tú, <@${member.user.id}>! Sí, tú. Bienvenido a DistopyCraft. Prepárate para perder el sueño y ganar amigos pixelados.`,
      `¡Qué jais, <@${member.user.id}>! Bienvenido al servidor donde los zombies tienen más swag que tú.`,
      `¡Arre, <@${member.user.id}>! Bienvenido a DistopyCraft, donde minamos diamantes y cultivamos memes.`,
      `¡Qué rollo con el pollo, <@${member.user.id}>! Bienvenido a DistopyCraft, el único lugar donde puedes ser un noob con estilo.`,
      `¡Quihúboles, <@${member.user.id}>! Bienvenido a DistopyCraft, donde hasta los slimes tienen flow.`,
      `¡Qué pedo, <@${member.user.id}>! (Perdón, fue el Ghast). Bienvenido a DistopyCraft, hogar de los mejores constructores y los peores chistes.`,
      `¡Epa epa, <@${member.user.id}>! Bienvenido a DistopyCraft. Aquí los creepers son más amigables que tu ex.`,
      `¡Qué onda, mi buen <@${member.user.id}>! Bienvenido a DistopyCraft, donde puedes ser un rey, un vagabundo, o ambos... nadie juzga.`,
      `¡Qué tranza, valedor <@${member.user.id}>! Bienvenido a DistopyCraft. Prepara tus dedos para clickear más rápido que Sonic corriendo.`
    ];

    const welcomeChannel = member.guild.channels.cache.get(config.bot.channels.welcome);
    if (!welcomeChannel) {
      console.error(`El canal de bienvenida no existe para el servidor: ${member.guild.name}`);
      return;
    }    
    const canvas = Canvas.createCanvas(1920, 1080);
    const ctx = canvas.getContext('2d');

    // Background color
    const background = loadImage('../../data/welcome.png')
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