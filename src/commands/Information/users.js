const {
    MessageFlags,
    ContainerBuilder,
    TextDisplayBuilder
} = require('discord.js');
const emoji = require('../../emojis');

module.exports = {
    name: 'users',
    description: "Hiện tổng số người dùng và máy chủ",
    category: 'Information',
    aliases: ['botusers'],

    async execute(message, args, client) {
        const totalServers = client.guilds.cache.size.toLocaleString();
        const totalUsers = client.users.cache.size.toLocaleString();

        const display = new TextDisplayBuilder()
            .setContent(
                `**Groove's Users !**\n` +
                `${emoji.blank}${emoji.wickarrow} Total of **__${totalUsers}__** users in **__${totalServers}__** servers`
            );

        const container = new ContainerBuilder()
            .addTextDisplayComponents(display);

        return message.reply({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};
