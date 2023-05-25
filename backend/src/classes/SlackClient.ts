import { App } from "@slack/bolt"
import { IChat } from "../types/slack"
import chat from "./slackCommands/chat"
import { botsReady, discordBot, expressClient } from "../main"
const BASEPORT = 3999 as const

export default class SlackClient extends App {
	private ready: boolean = false
	public chats = new Map<string, IChat[]>()
	constructor(secret: string, token: string, appToken: string, port?: number) {
		super({
			token,
			signingSecret: secret,
			socketMode: true,
			appToken
		})

		this.startApp(port)
	}

	private startApp(port?: number) {
		this.start(port || BASEPORT)
			.then(() => {
				this.ready = true
				console.log(`Slack client started on port ${port || BASEPORT}`)
				this.initListeners()
			})
			.then(() => {
				console.log("Waiting for chatBots to be ready...")
				new Promise<void>((resolve, reject) => {
					const interval = setInterval(() => {
						if (botsReady) {
							clearInterval(interval)
							console.log("ChatBots ready!")
							this.initCommands()
							resolve()
						}
					}, 500)
				})
			})
	}

	private initCommands() {
		const chatCmd = chat(this)
		this.command(chatCmd.name, chatCmd.execute)

		const actions = chatCmd.actions

		actions().forEach(action => {
			this.action(action.name, action.execute)
		})
	}

	private initListeners() {
		console.log("Initializing listeners...")
		this.message(async ({ message, say }) => {
			console.log(message)
			if (
				message.subtype === undefined ||
				message.subtype === "bot_message" ||
				message.subtype === "file_share" ||
				message.subtype === "thread_broadcast"
			) {
				await say(`Hello, <@${message.user}>`)
			}
		})
	}

	public isReady() {
		return this.ready
	}
}
