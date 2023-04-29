import { WebSocketServer } from "ws"
import ExpressClient from "./ExpressClient"
import { randomUUID } from "crypto"
import RiveScript from "rivescript"
import { prisma } from ".."
import http from "http"

/**
 * Instance of a chat bot
 */
export default class ChatBot {
	/**
	 * Array of all chat bots
	 */
	public static chatBots: ChatBot[] = []

	/**
	 * id of the chat bot
	 */
	private id: string

	/**
	 * Name of the chat bot
	 */
	private name: string

	/**
	 * ExpressClient instance for the web chat client
	 */
	private expressClient!: ExpressClient

	/**
	 * WebSocketServer instance for the web chat client
	 */
	private wss!: WebSocketServer // send data with Content-Type: text/plain; charset=utf-8

	/**
	 * The Brain of the chat bot
	 */
	private rivescriptBot: RiveScript

	private brain!: string

	/**
	 * Creates an instance of ChatBot.
	 * @param name The name of the chat bot
	 */
	constructor(name: string) {
		this.name = name
		this.id = randomUUID()
		while (ChatBot.chatBots.some(bot => bot.id === this.id)) {
			this.id = randomUUID()
		}

		this.rivescriptBot = new RiveScript({ utf8: true })
		this.setBrain("standard.rive")
		this.rivescriptBot.unicodePunctuation = new RegExp(/[.,!?;:]/g)

		this.startWebChatClient()

		ChatBot.chatBots.push(this)
	}

	/**
	 * Starts the web chat client
	 */
	private startWebChatClient() {
		let port = process.env.PORT ? Number(process.env.PORT) + 1 : 4001
		while (ExpressClient.usedPorts.includes(port)) {
			port++
		}

		this.expressClient = new ExpressClient([], port)
		const server = http.createServer(this.expressClient.getApp())
		this.wss = new WebSocketServer({ server })

		this.wss.on("connection", function connection(ws) {
			ws.on("open", function open() {
				console.log("connected")
			})
			ws.on("message", function incoming(data) {
				console.log(data)
			})
			ws.on("close", function close() {
				console.log("disconnected")
			})
		})

		this.expressClient.startWithServer(server)
	}

	public async getBrain() {
		try {
			const brain = await prisma.brains.findUnique({
				where: {
					name: this.brain
				}
			})
			if (!brain) throw new Error("Brain not found")
			return brain
		} catch (error) {
			console.error(error)
		}
	}

	/**
	 * Sets the brain of the chat bot
	 * @param name The name of the brain to set
	 */
	private async setBrain(name: string) {
		try {
			const file = await prisma.brains.findUnique({
				where: {
					name: name
				}
			})
			if (!file) throw new Error("Brain not found")

			if (this.rivescriptBot.stream(file.data, error => console.log(error))) {
				this.brain = name
				console.log("Brain set")
			}
		} catch (error) {
			console.error(error)
		}
	}

	/**
	 * Gets the id of the chat bot
	 * @returns The id of the chat bot
	 */
	public getId(): string {
		return this.id
	}

	/**
	 * Gets the name of the chat bot
	 * @returns The name of the chat bot
	 */
	public getName(): string {
		return this.name
	}

	/**
	 * Gets the port the server is running on
	 * @returns The port the server is running on
	 */
	public getPort(): number {
		return this.expressClient.getPort()
	}

	/**
	 * Gets the ExpressClient instance
	 * @returns The ExpressClient instance
	 */
	public getExpressClient(): ExpressClient {
		return this.expressClient
	}

	/**
	 * Gets the WebSocketServer instance
	 * @returns The WebSocketServer instance
	 */
	public getWss(): WebSocketServer {
		return this.wss
	}

	/**
	 * Gets the Brain of the chat bot
	 * @returns The Brain of the chat bot
	 */
	public getRivescriptBot(): RiveScript {
		return this.rivescriptBot
	}

	/**
	 * Closes the server
	 */
	public close() {
		this.wss.close()
		this.expressClient.close()
	}
}
