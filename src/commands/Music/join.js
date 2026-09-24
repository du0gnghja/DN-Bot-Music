const {
  MessageFlags,
  PermissionsBitField,
  ContainerBuilder,
  TextDisplayBuilder
} = require("discord.js");
const emoji = require("../../emojis");

module.exports = {
  name: "join",
  aliases: ["j"],
  category: "Music",
  cooldown: 3,
  description: "Vào kênh thoại",
  args: false,
  usage: "",
  userPrams: [],
  botPrams: ["EMBED_LINKS"],
  owner: false,
  player: false,
  inVoiceChannel: true,
  sameVoiceChannel: false,
  slashOptions: [],

  async slashExecute(interaction, client) {
    if (!interaction.member.voice.channel) {
      const errorDisplay = new TextDisplayBuilder()
        .setContent(`**${client.emoji.warn} Bạn cần vào kênh thoại để dùng lệnh này.**`);

      const container = new ContainerBuilder()
        .addTextDisplayComponents(errorDisplay);

      return interaction.reply({
        components: [container],
        flags: MessageFlags.IsComponentsV2
      });
    }

    const { channel } = interaction.member.voice;
    const player = client.manager.players.get(interaction.guild.id);

    if (player) {
      const warnDisplay = new TextDisplayBuilder()
        .setContent(`**${client.emoji.warn} Mình đang kết nối tới <#${player.voiceId}>**`);

      const container = new ContainerBuilder()
        .addTextDisplayComponents(warnDisplay);

      return interaction.reply({
        components: [container],
        flags: MessageFlags.IsComponentsV2
      });
    }

    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.resolve(["Speak", "Connect"]))) {
      const errorDisplay = new TextDisplayBuilder()
        .setContent(`**${client.emoji.warn} I don't have enough permissions to execute this command! Please give me permission \`CONNECT\` or \`SPEAK\`.**`);

      const container = new ContainerBuilder()
        .addTextDisplayComponents(errorDisplay);

      return interaction.reply({
        components: [container],
        flags: MessageFlags.IsComponentsV2
      });
    }

    await client.manager.createPlayer({
      guildId: interaction.guild.id,
      voiceId: interaction.member.voice.channel.id,
      textId: interaction.channel.id,
      volume: 100,
      deaf: true,
      mute: false,
    });

    const successDisplay = new TextDisplayBuilder()
      .setContent(`**${client.emoji.check} Đã vào <#${channel.id}> và gắn với <#${interaction.channel.id}>**`);

    const container = new ContainerBuilder()
      .addTextDisplayComponents(successDisplay);

    return interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  },

  async execute(message, args, client, prefix) {
    if (!message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.SendMessages)) {
      try {
        await message.author.send({
          content: `Mình không có quyền gửi tin trong <#${message.channel.id}> in **${message.guild.name}**`
        });
      } catch (e) { }
      return;
    }

    const { channel } = message.member.voice;
    const player = client.manager.players.get(message.guild.id);

    if (player) {
      const warnDisplay = new TextDisplayBuilder()
        .setContent(`**${client.emoji.warn} Mình đang kết nối tới <#${player.voiceId}>**`);

      const container = new ContainerBuilder()
        .addTextDisplayComponents(warnDisplay);

      return await message.channel.send({
        components: [container],
        flags: MessageFlags.IsComponentsV2
      });
    }

    if (
      !message.guild.members.me.permissions.has(
        PermissionsBitField.resolve(["Speak", "Connect"]),
      )
    ) {
      const errorDisplay = new TextDisplayBuilder()
        .setContent(
          `**${client.emoji.warn} I don't have enough permissions to execute this command! Please give me permission \`CONNECT\` or \`SPEAK\`.**`
        );

      const container = new ContainerBuilder()
        .addTextDisplayComponents(errorDisplay);

      return message.channel.send({
        components: [container],
        flags: MessageFlags.IsComponentsV2
      });
    }

    await client.manager.createPlayer({
      guildId: message.guild.id,
      voiceId: message.member.voice.channel.id,
      textId: message.channel.id,
      volume: 100,
      deaf: true,
      mute: false,
    });

    const successDisplay = new TextDisplayBuilder()
      .setContent(
        `**${client.emoji.check} Đã vào <#${channel.id}> và gắn với <#${message.channel.id}>**`
      );

    const container = new ContainerBuilder()
      .addTextDisplayComponents(successDisplay);

    return message.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  },
};

