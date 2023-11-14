require("dotenv").config();
const {
  Client,
  IntentsBitField,
  ActivityType,
  Events,
  EmbedBuilder,
} = require("discord.js");
const { request } = require("undici");
const axios = require("axios");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

let status = [
  {
    name: "Exploring the Grand Sea",
    type: ActivityType.Playing,
  },
  {
    name: "Exploring the New World",
    type: ActivityType.Playing,
  },
  {
    name: "One Piece",
    type: ActivityType.Streaming,
    url: "https://www.youtube.com/watch?v=xPyJ2XhSKOI",
  },
  {
    name: "Binks Sake",
    type: ActivityType.Streaming,
    url: "https://www.youtube.com/watch?v=46SJtTC23yE",
  },
];

client.on("ready", (c) => {
  console.log(`${c.user.username} is online`);
  client.user.setUsername("LuffyBOT");

  setInterval(() => {
    let random = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[random]);
  }, 10000);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) {
    return;
  }

  if (message.content === "one piece?") {
    message.reply("THE ONE PIECE IS REAL!");
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const { commandName } = interaction;
  await interaction.deferReply();

  if (commandName === "onepiece") {
    interaction.editReply("THE ONE PIECE IS REAL!");
  }

  if (commandName === "lolz") {
    interaction.editReply(
      "https://cdn.discordapp.com/attachments/1065951898613600279/1066826797859221604/7f75b03f23294ffa31678a6322c9a6a0.png"
    );
  }
});

client.on("messageCreate", async (message) => {
  let msgArray = message.content.split(" "); // Splits the message content with space as a delimiter
  let command = msgArray[0]; // Gets the first element of msgArray
  let args = msgArray.slice(1); // Remove the first element of msgArray/command and this basically returns the arguments

  if (command === "!character") {
    try {
      const response = await axios.get(
        "https://api.jikan.moe/v4/anime/21/characters"
      );
      const data = response.data;
      let a = Math.random() * 500;
      let x = Math.round(a);
      var name = `${data.data[x].character.name}`;
      var picture = `${data.data[x].character.images.jpg.image_url}`;
      var url = `${data.data[x].character.url}`;
      var role = `${data.data[x].role}`;

      const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Character")
        .setURL(url)
        .addFields(
          {
            name: "Name:",
            value: name,
            inline: true,
          },
          {
            name: "Role:",
            value: role,
            inline: true,
          }
        )
        .setImage(picture);
      message.reply({ embeds: [exampleEmbed] });
    } catch (error) {
      console.error(error);
      message.reply("An error occurred while fetching data.");
    }
  }

  if (command === "!search") {
    if (!args[0]) return message.reply("Please specify an username.");
    let input = args[0];

    try {
      const response = await axios.get(
        "https://api.jikan.moe/v4/users/" + input + "/full"
      );
      const data = response.data;
      var name = `${data.data.username}`;
      var watching = `${data.data.statistics.anime.watching}`;
      var total = `${data.data.statistics.anime.episodes_watched}`;
      var picture = `${data.data.images.jpg.image_url}`;
      var url = `${data.data.url}`;
      var lo = `${data.data.last_online}`;
      var lastOnline = lo.substring(0, 10);

      const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(name + "'s Profile")
        .setURL(url)
        .addFields(
          {
            name: "Watching:",
            value: watching + " anime (s)",
            inline: true,
          },
          {
            name: "Total watched:",
            value: total + " episodes",
            inline: true,
          }
        )
        .setImage(picture)
        .setFooter({
          text: "Last online: " + lastOnline,
        });
      message.reply({ embeds: [exampleEmbed] });
    } catch (error) {
      message.reply("The specified user doesn't exist!");
    }
  }
});

client.login(process.env.TOKEN);
