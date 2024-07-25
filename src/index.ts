import { config } from "dotenv";
import {
  Client,
  GatewayIntentBits,
  Message,
  Events,
  TextChannel,
} from "discord.js";

config();
const botToken = process.env.BOT_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // discord server related events, such as create/delete a channel/thread
    GatewayIntentBits.GuildMessages, // message related events, such as message create/update, but not the message content
    GatewayIntentBits.MessageContent,
  ],
});

client.login(botToken);

client.once(Events.ClientReady, () => {
  console.log(`Bot logged in as ${client.user?.tag}`);

  const botName = client.user?.username;

  client.on(Events.MessageCreate, (message: Message) => {
    if (message.channel instanceof TextChannel) {
      if (!message.author.bot && message.content === "hi bot") {
        message.reply(
          `Hi, I am ${botName}, a bot that plays rock-paper-scissors with you.`
        );
      }
      console.log(`${message.author.username}: ${message.content}`);
    }
  });
});
