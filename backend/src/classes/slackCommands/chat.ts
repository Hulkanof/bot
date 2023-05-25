import { AckFn, KnownBlock, RespondArguments, SayFn } from "@slack/bolt"
import SlackClient from "../SlackClient"
import ChatBot from "../ChatBot"

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
				say(chooseEmbed)
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
						const chats = client.chats.get(action.body.user.id)
						const index = chats?.length || 0

						client.client.conversations
							.list({
								types: "private_channel"
							})
							.then(channels => {
								return channels.channels?.find(channel => channel.name === `${name}-chat-${index}`)
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

									if (channel.is_archived) {
										client.client.conversations.unarchive({
											channel: channel.id
										})
									}

									client.client.conversations.invite({
										channel: channel.id,
										users: action.body.user.id
									})
								} else {
									channel = (
										await client.client.conversations.create({
											name: `${name}-chat-${index}`,
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

								client.client.conversations.invite({
									channel: channel.id,
									users: action.body.user.id
								})

								client.client.chat.postMessage({
									channel: action.body.channel.id,
									text: `Chat already started with ${bot.getName()}!`
								})

								const chats = client.chats.get(action.body.user.id) ?? []
								chats.push({
									channelId: channel.id,
									chatBot: bot
								})

								client.chats.set(action.body.user.id, chats)
							})
					}
				}
			})
		}
	}
}
