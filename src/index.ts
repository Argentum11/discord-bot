import { config } from "dotenv";
import {
  Client,
  GatewayIntentBits,
  Message,
  Events,
  TextChannel,
  DMChannel,
  Partials,
} from "discord.js";

if (process.env.NODE_ENV !== "production") {
  config();
}

const botToken = process.env.BOT_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // discord server related events, such as create/delete a channel/thread
    GatewayIntentBits.GuildMessages, // message related events, such as message create/update, but not the message content
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

client.login(botToken);

client.once(Events.ClientReady, () => {
  console.log(`Bot logged in as ${client.user?.tag}`);

  const botName = client.user?.username;

  client.on(Events.MessageCreate, (message: Message) => {
    if (message.channel instanceof DMChannel) {
      if (!message.author.bot && message.content === "hi bot") {
        message.reply(
          `Hi, I am ${botName}, a bot that plays rock-paper-scissors with you.`
        );
      }
      console.log(`${message.author.username}: ${message.content}`);
    }
  });
});
