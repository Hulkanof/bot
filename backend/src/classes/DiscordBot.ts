import { Client, ClientOptions } from "discord.js"
import { discordDefaultOptions } from "../constants"
import type { DiscordClientConfig } from "../types/discord"

/**
 * Discord Bot Client
 */
export default class DiscordBot extends Client {
	/**
	 * Whether the bot is ready
	 */
	private ready = false

	/**
	 * The config for the bot
	 */
	private config: DiscordClientConfig

	/**
	 * Creates an instance of DiscordBot.
	 * @param config Config for the bot
	 * @param options Options for the bot
	 */
	constructor(config: DiscordClientConfig, options: ClientOptions = discordDefaultOptions) {
		super(options)
		this.config = config
		this.start()
	}

	/**
	 * Changes the config and reloads the bot
	 * @param config The new config
	 */
	public changeConfig(config: DiscordClientConfig) {
		this.ready = false
		this.config = config
		this.destroy()
		this.start()
	}

	/**
	 *
	 * @returns true if the bot is ready
	 */
	public isReady() {
		return this.ready
	}

	/**
	 * Starts the bot with the current config
	 */
	private start() {
		this.login(this.config.token)
		this.on("ready", () => {
			this.ready = true
			console.log(`Logged in as ${this.user?.tag}`)
		})
	}

	/**
	 * Stops the bot
	 */
	public stop() {
		this.destroy()
	}
}
