import {
  REST,
  Routes,
  Interaction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ButtonInteraction,
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export enum CommandName {
  Rule = "rule",
  Vote = "vote",
}

const commands = [
  new SlashCommandBuilder()
    .setName(CommandName.Rule)
    .setDescription("Rules for Rock, Paper, Scissors")
    .toJSON(),
  new SlashCommandBuilder()
    .setName(CommandName.Vote)
    .setDescription("Start a vote")
    .toJSON(),
];

const buttonConfig = {
  yes: {
    customId: "yes",
    label: "Yes",
    style: ButtonStyle.Success,
  },
  no: {
    customId: "no",
    label: "No",
    style: ButtonStyle.Danger,
  },
};

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

export async function removeAllCommands(botToken: string, appId: string) {
  const rest = new REST({ version: "10" }).setToken(botToken);

  try {
    console.log("Started removing application (/) commands.");

    await rest.put(Routes.applicationCommands(appId), { body: [] });

    console.log("Successfully removed all application (/) commands.");
  } catch (error) {
    console.error("Error removing commands:", error);
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
    case CommandName.Vote:
      const yesButton = new ButtonBuilder()
        .setCustomId(buttonConfig.yes.customId)
        .setLabel(buttonConfig.yes.label)
        .setStyle(buttonConfig.yes.style);

      const noButton = new ButtonBuilder()
        .setCustomId(buttonConfig.no.customId)
        .setLabel(buttonConfig.no.label)
        .setStyle(buttonConfig.no.style);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        yesButton,
        noButton
      );

      await interaction.reply({
        content: "Do you want to start a vote?",
        components: [row],
      });
      break;
    default:
      await interaction.reply("Unknown command");
  }
}

export async function buttonHandler(interaction: ButtonInteraction) {
  // Ensure the interaction is a button interaction
  if (!interaction.isButton()) return;

  // Get the custom ID of the button that was clicked
  const { customId } = interaction;

  try {
    switch (customId) {
      case buttonConfig.yes.customId:
        await interaction.update({
          content: "You voted Yes!",
          components: [], // Remove the buttons after voting
        });
        break;
      case buttonConfig.no.customId:
        await interaction.update({
          content: "You voted No!",
          components: [], // Remove the buttons after voting
        });
        break;
      default:
        await interaction.update({
          content: "Unknown button interaction",
          components: [], // Remove the buttons
        });
    }
  } catch (error) {
    console.error("Error handling button interaction:", error);
    // Attempt to send a follow-up message if the interaction can't be updated
    try {
      await interaction.followUp({
        content: "There was an error processing your vote. Please try again.",
        ephemeral: true,
      });
    } catch (followUpError) {
      console.error("Error sending follow-up message:", followUpError);
    }
  }
}
