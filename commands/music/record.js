const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Reproduce una cancion o un playlist.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('song')
                .setDescription('Reproduce una cancion.')
                .addStringOption(option =>
                    option
                        .setName('song')
                        .setDescription('Canción a reproducir.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('playlist')
                .setDescription('Reproduce una playlist.')
                .addStringOption(option =>
                    option
                        .setName('playlist')
                        .setDescription('Playlist a reproducir.')
                        .setRequired(true)
                )
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case 'start':
                // you need to create guild queue first
                const queue = player.nodes.create(interaction.guildId);

                try {
                    // make sure to connect to a voice channel which you want to record audio from
                    await queue.connect(interaction.member.voice.channelId, {
                        deaf: false // make sure self deaf is false otherwise bot wont hear your audio
                    });
                } catch {
                    return interaction.followUp('Failed to connect to your channel');
                }

                // initialize receiver stream
                const stream = queue.voiceReceiver.recordUser(interaction.member.id, {
                    mode: 'pcm', // record in pcm format
                });

                const writer = stream.pipe(createWriteStream(`./recording-${interaction.member.id}.pcm`)); // write the stream to a file

                writer.once('finish', () => {
                    if (interaction.isRepliable()) interaction.followUp(`Finished writing audio!`);
                    queue.delete(); // cleanup
                });
            case 'stop':
                

        }
    }
};