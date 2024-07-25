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
});

client.on(Events.MessageCreate, (message: Message) => {
  if (message.channel instanceof TextChannel) {
    console.log(`${message.author.displayName}: ${message.content}`);
  }
});
