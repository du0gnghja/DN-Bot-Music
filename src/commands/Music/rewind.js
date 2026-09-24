const {
    ContainerBuilder,
    TextDisplayBuilder,
    MessageFlags
} = require("discord.js");
const emoji = require("../../emojis");

module.exports = {
    name: "rewind",
    aliases: ["rw", "backward"],
    category: "Music",
    cooldown: 3,
    description: "Tua lùi bài đang phát",
    args: false,
    usage: "[seconds]",
    userPrams: [],
    botPrams: ["EMBED_LINKS"],
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,

    slashOptions: [
        {
            name: "seconds",
            description: "Số giây tua lùi (mặc định: 10)",
            type: 4,
            required: false
        }
    ],

    async slashExecute(interaction, client) {
        const player = client.manager.players.get(interaction.guild.id);
        if (!player.queue.current) {
            const errorDisplay = new TextDisplayBuilder()
                .setContent(`**${client.emoji.warn} Hãy phát một bài trước.**`);
            const container = new ContainerBuilder().addTextDisplayComponents(errorDisplay);
            return interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
        }

        let seconds = interaction.options.getInteger("seconds") || 10;
        const currentPosition = player.position;
        const newPosition = Math.max(0, currentPosition - (seconds * 1000));

        try {
            await player.seek(newPosition);
            const formatTime = (ms) => {
                const totalSeconds = Math.floor(ms / 1000);
                const minutes = Math.floor(totalSeconds / 60);
                const secs = totalSeconds % 60;
                return `${minutes}:${secs.toString().padStart(2, '0')}`;
            };
            const successDisplay = new TextDisplayBuilder()
                .setContent(`**${client.emoji.check} Rewound \`${seconds}s\` to \`${formatTime(newPosition)}\`**`);
            const container = new ContainerBuilder().addTextDisplayComponents(successDisplay);
            return interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
        } catch (error) {
            console.error("Error rewinding:", error);
            const errorDisplay = new TextDisplayBuilder().setContent(`**${client.emoji.cross} Không tua lùi được bài này.**`);
            const container = new ContainerBuilder().addTextDisplayComponents(errorDisplay);
            return interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
        }
    },

    async execute(message, args, client, prefix) {
        const player = client.manager.players.get(message.guild.id);

        if (!player.queue.current) {
            const errorDisplay = new TextDisplayBuilder()
                .setContent(`**${client.emoji.warn} Hãy phát một bài trước.**`);

            const container = new ContainerBuilder()
                .addTextDisplayComponents(errorDisplay);

            return message.channel.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });
        }

        let seconds = 10;

        if (args.length > 0) {
            seconds = parseInt(args[0]);

            if (isNaN(seconds) || seconds <= 0) {
                const usageDisplay = new TextDisplayBuilder()
                    .setContent(
                        `**${client.emoji.cross} Usage** \`:\` \`${prefix}rewind [seconds]\`\n` +
                        `**${client.emoji.dot} Example** \`:\` \`${prefix}rewind 30\` - Rewind 30 seconds`
                    );

                const container = new ContainerBuilder()
                    .addTextDisplayComponents(usageDisplay);

                return message.reply({
                    components: [container],
                    flags: MessageFlags.IsComponentsV2
                }).catch(() =>
                    message.channel.send({
                        components: [container],
                        flags: MessageFlags.IsComponentsV2
                    })
                );
            }
        }

        const currentPosition = player.position;
        const newPosition = Math.max(0, currentPosition - (seconds * 1000));

        try {
            await player.seek(newPosition);

            const formatTime = (ms) => {
                const totalSeconds = Math.floor(ms / 1000);
                const minutes = Math.floor(totalSeconds / 60);
                const secs = totalSeconds % 60;
                return `${minutes}:${secs.toString().padStart(2, '0')}`;
            };

            const successDisplay = new TextDisplayBuilder()
                .setContent(`**${client.emoji.check} Rewound \`${seconds}s\` to \`${formatTime(newPosition)}\`**`);

            const container = new ContainerBuilder()
                .addTextDisplayComponents(successDisplay);

            return message.reply({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            }).catch(() =>
                message.channel.send({
                    components: [container],
                    flags: MessageFlags.IsComponentsV2
                })
            );
        } catch (error) {
            console.error("Error rewinding:", error);

            const errorDisplay = new TextDisplayBuilder()
                .setContent(`**${client.emoji.cross} Không tua lùi được bài này.**`);

            const container = new ContainerBuilder()
                .addTextDisplayComponents(errorDisplay);

            return message.reply({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            }).catch(() =>
                message.channel.send({
                    components: [container],
                    flags: MessageFlags.IsComponentsV2
                })
            );
        }
    },
};
