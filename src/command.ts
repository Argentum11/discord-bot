import { REST, Routes, Interaction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export enum CommandName {
  Rule = "rule",
}

const commands = [
  new SlashCommandBuilder()
    .setName(CommandName.Rule)
    .setDescription("Rules for Rock, Paper, Scissors")
    .toJSON(),
];

export async function registerCommands(botToken: string, appId: string) {
  const rest = new REST({ version: "10" }).setToken(botToken);

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(appId), { body: commands });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error("Error registering commands:", error);
  }
}

export async function commandHandler(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;

  switch (interaction.commandName) {
    case CommandName.Rule:
      await interaction.reply(`Rock, Paper, Scissors is a simple hand game usually played between two people.
        
Each player simultaneously forms one of three shapes with their hand:
    Rock (a fist)
    Paper (an open hand)
    Scissors (a fist with the index and middle fingers extended, forming a V)

The rules are:
    Rock crushes Scissors
    Scissors cuts Paper
    Paper covers Rock`);
      break;
    default:
      await interaction.reply("Unknown command");
  }
}
