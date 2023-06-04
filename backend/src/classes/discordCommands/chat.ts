import { Colors, EmbedBuilder, Message, PermissionFlagsBits, ChannelType } from "discord.js"
import { ICommand } from "../../types/discord"
import DiscordBot from "../DiscordBot"
import ChatBot from "../ChatBot"

/**
 * Chat command
 * @param client Discord bot client
 * @returns Command
 */
export default function chat(client: DiscordBot): ICommand {
	return {
		name: "chat",
		helpName: "chat",
		description: "Chat with the bot",
		execute: async (message: Message, args: any) => {
			const guild = message.guild
			if (!guild) {
				message.reply("No guild found")
				return
			}

			const bots = ChatBot.chatBots.filter(bot => bot.serviceAccess["discord"] === true)
			if (!bots) {
				message.reply("No bots found")
				return
			}

			const name = message.author.username
			const chats = client.chats.get(message.author.id)
			const index = chats?.length || 0

			const channel = await guild.channels.create({
				name: `${name}-chat-${index}`,
				type: ChannelType.GuildText,
				permissionOverwrites: [
					{
						id: guild.roles.everyone.id,
						deny: PermissionFlagsBits.ViewChannel
					},
					{
						id: client.user?.id as string,
						allow: PermissionFlagsBits.ViewChannel
					},
					{
						id: message.author.id,
						allow: PermissionFlagsBits.SendMessages | PermissionFlagsBits.ViewChannel
					}
				]
			})

			if (!channel) {
				message.reply("No channel found")
				return
			}
			if (chats) chats.push({ channelId: channel.id })

			client.chats.set(message.author.id, chats || [{ channelId: channel.id }])

			const embed = new EmbedBuilder().setTitle("Chat").setDescription(`Chat created at ${channel}`).setColor(Colors.Fuchsia).setTimestamp()
			message.channel.send({ embeds: [embed] })

			const chooseEmbed = new EmbedBuilder().setTitle("Choose a bot").setColor(Colors.Purple)

			bots.forEach(bot => {
				chooseEmbed.addFields({ name: `name:`, value: bot.getName(), inline: false })
			})

			channel.send({ content: "Choose a bot to chat to! (!bot <name>)", embeds: [chooseEmbed] })
		}
	}
}
