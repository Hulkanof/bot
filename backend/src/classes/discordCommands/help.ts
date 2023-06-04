import { Colors, EmbedBuilder, Message } from "discord.js"
import { ICommand } from "../../types/discord"
import DiscordBot from "../DiscordBot"

/**
 * Help command
 * @param client Discord bot client
 * @returns Command
 */
export default function help(client: DiscordBot): ICommand {
	return {
		name: "help",
		helpName: "help",
		description: "Shows this message",
		execute: (message: Message, _args: any) => {
			const embed = new EmbedBuilder()
				.setTitle("Commands")
				.setDescription("List of all commands")
				.setColor("#00ff00")
				.setTimestamp()
				.setColor(Colors.Fuchsia)
			for (const [, cmd] of client.getCommands().entries()) {
				embed.addFields({ name: `!${cmd.helpName}`, value: `> ${cmd.description}`, inline: false })
			}
			message.channel.send({ embeds: [embed] })
		}
	}
}
