import { Client, ClientOptions } from "discord.js"
import { discordDefaultOptions } from "../constants"
import type { DiscordClientConfig } from "../types/discord"

export default class DiscordBot extends Client {
	private ready = false
	private config: DiscordClientConfig
	constructor(config: DiscordClientConfig, options: ClientOptions = discordDefaultOptions) {
		super(options)
		this.config = config

		this.login(config.token)
		this.on("ready", () => {
			this.ready = true
			console.log(`Logged in as ${this.user?.tag}`)
		})
	}

	public changeConfig(config: DiscordClientConfig) {
		this.ready = false
		this.config = config
		this.destroy()
		this.login(config.token)
		this.on("ready", () => {
			this.ready = true
			console.log(`Logged in as ${this.user?.tag}`)
		})
	}

	public isReady() {
		return this.ready
	}

	public stop() {
		this.destroy()
	}
}
