import { AckFn, KnownBlock, RespondArguments, SayFn } from "@slack/bolt"
import SlackClient from "../SlackClient"
import ChatBot from "../ChatBot"
import { text } from "stream/consumers"

/**
 * Chat command
 * @param client Slack client
 * @returns Chat command
 */
export default function chat(client: SlackClient) {
	return {
		name: "/chat",
		description: "Chat with a bot",
		execute: async ({ ack, say }: { ack: AckFn<string | RespondArguments>; say: SayFn }) => {
			try {
				await ack()
				const bots = ChatBot.chatBots.filter(bot => bot.serviceAccess["slack"] === true)
				const chooseEmbed = {
					blocks: [
						{
							type: "section",
							text: {
								type: "mrkdwn",
								text: "Choose a bot"
							}
						},
						{
							type: "divider"
						}
					]
				} satisfies { blocks: KnownBlock[] }
				bots.forEach(bot => {
					const block = {
						type: "section",
						text: {
							type: "mrkdwn",
							text: `*${bot.getName()}*`
						},
						accessory: {
							type: "button",
							text: {
								type: "plain_text",
								text: "Choose"
							},
							value: bot.getName(),
							style: "primary",
							action_id: `button-action-${bot.getName()}`
						}
					} satisfies KnownBlock
					chooseEmbed.blocks?.push(block)
				})
				say({
					blocks: chooseEmbed.blocks,
					text: "Choose a bot"
				})
			} catch (err) {
				console.error(err)
			}
		},
		actions: () => {
			const bots = ChatBot.chatBots.filter(bot => bot.serviceAccess["slack"] === true)
			return bots.map(bot => {
				return {
					name: `button-action-${bot.getName()}`,
					execute: async (action: any) => {
						try {
							const bots = ChatBot.chatBots.filter(bot => bot.serviceAccess["slack"] === true)
							const bot = bots.find(bot => bot.getName() === action.payload.value)
							if (!bot) {
								client.client.chat.postMessage({
									channel: action.body.channel.id,
									text: "Bot not found!"
								})
								console.error("Bot not found!")
								return
							}

							const name = action.body.user.username

							client.client.conversations
								.list({
									types: "private_channel"
								})
								.then(channels => {
									return channels.channels?.find(channel => channel.name === `${name}-chat-${bot.getName()}`)
								})
								.then(async channel => {
									if (channel) {
										if (!channel.id) {
											client.client.chat.postMessage({
												channel: action.body.channel.id,
												text: "Channel not found!"
											})
											console.error("Channel not found!")
											return
										}
									} else {
										channel = (
											await client.client.conversations.create({
												name: `${name}-chat-${bot.getName()}`,
												is_private: true
											})
										).channel

										if (!channel || !channel.id) {
											client.client.chat.postMessage({
												channel: action.body.channel.id,
												text: "Channel not found!"
											})
											console.error("Channel not found!")
											return
										}
									}

									if (channel.is_archived) {
										client.client.conversations.unarchive({
											channel: channel.id
										})
									}

									const channelMembers = await client.client.conversations.members({
										channel: channel.id
									})

									if (!channelMembers.members?.includes(action.body.user.id))
										client.client.conversations.invite({
											channel: channel.id,
											users: action.body.user.id
										})

									client.client.chat.postMessage({
										channel: action.body.channel.id,
										text: `Chat with ${bot.getName()} started in channel <#${channel.id}>!`
									})

									const chats = client.chats.get(action.body.user.id) ?? []
									chats.push({
										channelId: channel.id,
										chatBot: bot
									})

									client.chats.set(action.body.user.id, chats)
								})
						} catch (err) {
							console.error(err)
						}
					}
				}
			})
		}
	}
}
