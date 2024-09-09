import { config } from "dotenv";
import {
  Client,
  GatewayIntentBits,
  Message,
  Events,
  DMChannel,
  Partials,
} from "discord.js";
import {
  commandHandler,
  registerCommands,
  removeAllCommands,
  buttonHandler,
} from "./command";

if (process.env.NODE_ENV !== "production") {
  config();
}

const botToken = process.env.BOT_TOKEN;
const appId = process.env.APP_ID;

async function handleShutdown(signal: string, client: Client) {
  console.log(`Received ${signal}. Removing commands and shutting down...`);
  if (botToken && appId) {
    await removeAllCommands(botToken, appId);
  } else {
    console.error("Unable to remove commands: botToken or appId is undefined");
  }
  client.destroy();
  process.exit(0);
}

async function startBot() {
  if (!botToken) {
    throw new Error("Bot token is undefined");
  }
  if (!appId) {
    throw new Error("App ID is undefined");
  }

  await registerCommands(botToken, appId);

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

    client.on(Events.InteractionCreate, async (interaction) => {
      if (interaction.isChatInputCommand()) {
        await commandHandler(interaction);
      } else if (interaction.isButton()) {
        await buttonHandler(interaction);
      }
    });

    // Handle graceful shutdown
    process.on("SIGINT", () => handleShutdown("SIGINT", client));
    process.on("SIGTERM", () => handleShutdown("SIGTERM", client));
  });
}

startBot();
