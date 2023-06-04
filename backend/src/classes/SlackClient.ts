import { App, GenericMessageEvent, LogLevel } from "@slack/bolt"
import { IChat } from "../types/slack"
import chat from "./slackCommands/chat"
import { botsReady, discordBot, expressClient } from "../main"
import ChatBot from "./ChatBot"
const BASEPORT = 3999 as const

export default class SlackClient extends App {
	private ready: boolean = false
	public chats = new Map<string, IChat[]>()
	constructor(secret: string, token: string, appToken: string, port?: number) {
		super({
			token,
			signingSecret: secret,
			socketMode: true,
			appToken,
			logLevel: LogLevel.ERROR
		})

		this.error(async error => {
			console.error("test")
		})

		this.startApp(port)
	}

	private startApp(port?: number) {
		this.start(port || BASEPORT)
			.then(() => {
				this.ready = true
				console.log(`[SlackClient] Slack client started on port ${port || BASEPORT}`)
			})
			.then(() => {
				console.log("[SlackClient] Waiting for chatBots to be ready...")
				new Promise<void>((resolve, _) => {
					const interval = setInterval(() => {
						if (botsReady) {
							clearInterval(interval)
							this.initCommands()
							this.initListeners()
							resolve()
						}
					}, 500)
				})
			})
			.catch(err => {
				console.log(`[SlackClient] ${err}`)
			})
	}

	private initCommands() {
		const chatCmd = chat(this)
		this.command(chatCmd.name, chatCmd.execute)
		chatCmd.actions().forEach(action => {
			this.action(action.name, action.execute)
		})
	}

	private initListeners() {
		console.log("[SlackClient] Initializing listeners...")
		this.message(async ({ message, say }) => {
			if (!isGroupChatMessage(message)) return

			const channel = await this.client.conversations.info({
				channel: message.channel
			})
			if (channel.channel === undefined) return console.log(`[SlackClient] Channel undefined`)

			if (channel.channel.is_archived) return

			const user = await this.client.users.info({
				user: message.user
			})
			if (!user || !user.user || !user.user.id || !user.user.name) return console.log(`[SlackClient] User undefined`)
			const username = user.user.name

			if (channel.channel.name?.split("-")[0] !== username) return

			const chat = this.chats.get(user.user.id)
			if (!chat) {
				say("You have to start a chat first! Use `/chat` to start a chat with me.")
				return
			}

			const bot = chat.find(c => c.channelId === channel.channel?.id)?.chatBot
			if (!bot) return console.log(`[SlackClient] Bot undefined`)
			if (!message.text) return console.log(`[SlackClient] Message text undefined`)
			const text = message.text

			bot.getRivescriptBot()
				.reply(username, text)
				.then(reply => {
					say(reply)
					if (!ChatBot.conversations) ChatBot.conversations = {}
					if (!ChatBot.conversations[username]) ChatBot.conversations[username] = []
					ChatBot.conversations[username].push({
						chatBotName: bot.getName(),
						author: username,
						service: "slack",
						question: text,
						answer: reply
					})
				})
				.catch(err => {
					console.log(`[SlackClient] ${err}`)
				})
		})
	}

	public isReady() {
		return this.ready
	}
}

function isGroupChatMessage(message: any): message is GenericMessageEvent {
	if (message.subtype === "bot_message") return false
	if (message.channel_type !== "group") return false
	if (message.text === undefined) return false
	return true
}
