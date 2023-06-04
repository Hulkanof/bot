import { Message } from "discord.js"
import { ICommand } from "../../types/discord"
import DiscordBot from "../DiscordBot"

/**
 * Stops the chats
 * @param client DiscordBot
 * @returns ICommand
 */
export default function stop(client: DiscordBot): ICommand {
	return {
		name: "stop",
		helpName: "stop",
		description: "Removes your channels and stops the chat (if executed in a chat channel it will only remove the channel)",
		execute: async (message: Message, _args: any) => {
			const guild = message.guild
			if (!guild) {
				message.reply("No guild found")
				return
			}

			const channelId = client.chats.get(message.author.id)
			if (!channelId) {
				message.reply("No chat found")
				return
			}

			for (let i = 0; i < channelId.length; i++) {
				const id = channelId[i].channelId
				const channel = await guild.channels.fetch(id)
				if (channel) channel.delete()
			}
			client.chats.delete(message.author.id)
		}
	}
}
