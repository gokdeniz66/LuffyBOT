require("dotenv").config();
const { Client, IntentsBitField, ActivityType, Events } = require("discord.js");
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
    url: "https://www.youtube.com/watch?v=HRaoYuRKBaA",
  },
];

client.on("ready", (c) => {
  console.log(`${c.user.username} is online`);

  setInterval(() => {
    let random = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[random]);
  }, 30000);
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

  if (commandName === "cat") {
    const catResult = await request("https://aws.random.cat/meow");
    const { file } = await catResult.body.json();
    interaction.editReply({ files: [file] });
  }
});

client.on("messageCreate", async (message) => {
  if (message.content === "!character") {
    try {
      const response = await axios.get(
        "https://api.jikan.moe/v4/anime/21/characters"
      );
      const data = response.data;
      let a = Math.random() * 100;
      let x = Math.round(a);
      message.reply(`${data.data[x].character.images.jpg.image_url}`);
      message.reply(`${data.data[x].character.name}`);
    } catch (error) {
      console.error(error);
      message.reply("An error occurred while fetching data.");
    }
  }
});

client.login(process.env.TOKEN);
