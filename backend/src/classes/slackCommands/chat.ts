import { AckFn, BlockAction, BlockUsersSelectAction, InteractiveMessage, KnownBlock, RespondArguments, SayFn, SlackAction } from "@slack/bolt"
import SlackClient from "../SlackClient"
import ChatBot from "../ChatBot"
import { ChildProcess } from "child_process"
import { StringIndexed } from "@slack/bolt/dist/types/helpers"

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
						console.log(action.payload, action.body.user)
						// const bots = ChatBot.chatBots.filter(bot => bot.serviceAccess["slack"] === true)

						// const bot = bots.find(bot => bot.getName() === actionId.value)
						// if (!bot) return
					}
				}
			})
		}
	}
}
