import { Client, Message } from "discord.js"
import { discordDefaultOptions } from "../constants/discordDefaultOptions"
import type { DiscordClientConfig, IChat, ICommand } from "../types/discord"
import help from "./discordCommands/help"
import chat from "./discordCommands/chat"
import stop from "./discordCommands/stop"
import { handlePrivateChat } from "../utils/discord/utils"

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
	 * Map of commands
	 *
	 * Key: Command name
	 *
	 * Value: Command
	 */
	private commands: Map<string, ICommand>

	/**
	 * Map of chats
	 *
	 * Key: User ID
	 *
	 * Value: Array of chats
	 */
	public chats = new Map<string, IChat[]>()

	/**
	 * Creates an instance of DiscordBot.
	 * @param config Config for the bot
	 */
	constructor(config: DiscordClientConfig) {
		super(discordDefaultOptions)
		this.config = config
		this.commands = new Map()
		this.chats = new Map()
		this.initCommands()
		this.initListeners()
		this.start()
	}

	/**
	 * Initializes the commands
	 */
	private initCommands() {
		const helpCmd = help(this)
		const chatCmd = chat(this)
		const stopCmd = stop(this)

		this.commands.set(helpCmd.name, helpCmd)
		this.commands.set(chatCmd.name, chatCmd)
		this.commands.set(stopCmd.name, stopCmd)
	}

	/**
	 *
	 * @returns The commands
	 */
	public getCommands() {
		return this.commands
	}

	/**
	 * Initializes the listeners
	 */
	private initListeners() {
		this.on("messageCreate", (message: Message) => {
			if (message.author.bot) return

			const chat = this.chats.get(message.author.id)?.find(chat => chat.channelId === message.channel.id)
			if (chat) return handlePrivateChat(this.chats, message, chat)

			if (message.content.startsWith(this.config.prefix)) this.handleCommands(message)
		})
	}

	/**
	 * Handles the commands
	 * @param message The message that was sent
	 */
	private handleCommands(message: Message) {
		const args = message.content.slice(this.config.prefix.length).trim().split(/ +/)

		const command = args.shift()?.toLowerCase()
		if (!command) return message.reply("No command provided")

		const cmd = this.commands.get(command)
		if (!cmd) return message.reply("Command not found")

		cmd.execute(message, args)
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
		this.login(this.config.token).catch(error => {
			console.error(error)
		})

		this.on("ready", () => {
			this.ready = true
			console.log(`[DiscordClient] Logged in as ${this.user?.tag}`)
		})

		this.on("error", error => {
			console.error(error)
		})
	}

	/**
	 * Stops the bot
	 */
	public async stop() {
		for (const [key, chat] of this.chats) {
			for (let i = 0; i < chat.length; i++) {
				const id = chat[i].channelId
				const channel = await this.channels.fetch(id)
				if (channel) await channel.delete()
			}
			this.chats.delete(key)
		}

		this.destroy()
	}
}
