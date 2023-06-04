import { WebSocketServer, Data } from "ws"
import ExpressClient from "./ExpressClient"
import { randomUUID } from "crypto"
import RiveScript from "rivescript"
import { prisma } from "../main"
import http from "http"
import { SocketClient } from "../types/express"
import { ServiceAccess } from "@prisma/client"
import { environment } from "../main"

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
	private expressClient?: ExpressClient

	/**
	 * WebSocketServer instance for the web chat client
	 */
	private wss!: WebSocketServer // send data with Content-Type: text/plain; charset=utf-8

	/**
	 * The Brain of the chat bot
	 */
	private rivescriptBot: RiveScript

	/**
	 * The name of the brain
	 */
	private brain!: string

	/**
	 * Array of all connected clients
	 */
	private socketClients: SocketClient[] = []

	/**
	 * list of conversations with the chat bot
	 */
	public static conversations: {
		[username: string]: {
			chatBotName: string
			service: { name: "webSocketServer"; port: number } | "discord" | "mastodon" | "slack"
			author: string
			question: string
			answer: string
		}[]
	}

	/**
	 * The service access of the chat bot
	 */
	public serviceAccess: ServiceAccess

	/**
	 * Creates an instance of ChatBot.
	 * @param name The name of the chat bot
	 */
	constructor(id: string, name: string, brain: string, serviceAccess: ServiceAccess) {
		this.id = id
		this.name = name
		this.serviceAccess = serviceAccess

		this.rivescriptBot = new RiveScript({ utf8: true })
		this.setBrain(brain)
		this.rivescriptBot.unicodePunctuation = new RegExp(/[.,!?;:]/g)

		if (serviceAccess.socket) this.startWebChatClient()

		ChatBot.chatBots.push(this)
	}

	/**
	 * Starts the web chat client
	 */
	private startWebChatClient() {
		const _this = this

		// find a free port to use
		let port = Number(environment.PORT) + 1
		while (ExpressClient.usedPorts.includes(port)) port++

		// create the express client and the web socket server
		this.expressClient = new ExpressClient([], port, { botName: this.name })
		const server = http.createServer(this.expressClient.getApp())
		this.wss = new WebSocketServer({ server })

		// Listen for new connections and handle them
		this.wss.on("connection", function connection(ws, req) {
			const urlParams = new URLSearchParams(req.url?.replace("/?", ""))
			const name = urlParams.get("name")
			if (!name) return ws.close()
			ws.send(`Connected to chatBot ${_this.name} as ${name}`)
			_this.socketClients.push({ ws, name })

			ws.on("message", async function incoming(data) {
				const index = _this.socketClients.findIndex(client => client.ws === ws)
				if (index === -1) return ws.send("Internal Server Error")

				if (!_this.socketClients[index].name && !data.toString().startsWith("/name ")) return ws.send("Please give your name (/name <name>)")

				// if the user wants to set his name save it and return
				if (data.toString().startsWith("/name ")) {
					const name = data.toString().replace("/name ", "").trim()

					_this.socketClients[index].name = name
					ws.send(`Hi ${name}!`)

					return console.log(`++ User ${name} connected to chatBot ${_this.name}`)
				}

				await _this.handleReceivedMessage(data, index)
			})
			ws.on("close", function close() {
				const index = _this.socketClients.findIndex(client => client.ws === ws)
				if (index === -1) return ws.send("Internal Server Error")

				const name = _this.socketClients[index].name
				console.log(`[ChatBot - ${_this.name}] -- User ${name} disconnected from chatBot ${_this.name}`)
				_this.socketClients.splice(index, 1)
			})
		})

		// start the express client
		this.expressClient.startWithServer(server)
	}

	/**
	 * Sets the brain of the chat bot
	 * @param brain The name of the brain
	 * @returns The brain
	 */
	private async handleReceivedMessage(data: Data, index: number) {
		if (!this.expressClient) return console.log("Internal Server Error")
		const client = this.socketClients[index]
		if (!client.name) return client.ws.send("Please give your name (/name <name>)")
		const username = client.name

		console.log(`[ChatBot - ${this.name}] ++ ${this.name} received from ${username}: ${data}`)

		// process the message with rivestcript and send the response back to the client
		this.rivescriptBot.reply(username, data.toString()).then(reply => {
			console.log(`[ChatBot - ${this.name}] -- ${this.name} sent to ${username}: ${reply}`)
			client.ws.send(reply)

			if (!ChatBot.conversations) ChatBot.conversations = {}
			if (!ChatBot.conversations[username]) ChatBot.conversations[username] = []
			ChatBot.conversations[username].push({
				chatBotName: this.name,
				service: { name: "webSocketServer", port: this.expressClient?.getPort() || 0 },
				question: data.toString(),
				author: username,
				answer: reply
			})
		})
	}

	/**
	 * Returns The brain of the chat bot
	 */
	public async getBrain() {
		try {
			if (!this.brain) throw new Error(`[ChatBot - ${this.name}] Brain not set`)
			const brain = await prisma.brains.findUnique({
				where: {
					name: this.brain
				}
			})
			if (!brain) throw new Error(`[ChatBot - ${this.name}] Brain not found`)
			return brain
		} catch (error) {
			console.error(error)
			throw new Error(`[ChatBot - ${this.name}] Internal Server Error`)
		}
	}

	/**
	 * Sets the brain of the chat bot
	 * @param name The name of the brain to set
	 */
	public async setBrain(name: string) {
		const brain = await prisma.brains.findUnique({
			where: {
				name: name
			}
		})
		if (!brain) throw new Error(`[ChatBot - ${this.name}] Brain not found`)

		if (!this.rivescriptBot.stream(brain.data, error => console.log(error))) {
			throw new Error(`[ChatBot - ${this.name}] Brain could not be set`)
		}

		// sort replies after loading
		this.rivescriptBot.sortReplies()

		this.brain = name
		console.log(`[ChatBot - ${this.name}] Brain set to "${name}"`)
		return brain
	}

	/**
	 * Gets the brain of the chat bot
	 * @param name The name of the brain to set
	 * @returns The brain of the chat bot
	 */
	public setName(newName: string) {
		this.name = newName
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
		return this.expressClient?.getPort() || 0
	}

	/**
	 * Gets the ExpressClient instance
	 * @returns The ExpressClient instance
	 */
	public getExpressClient(): ExpressClient | undefined {
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
	public stop() {
		this.wss.close(error => (error ? console.error(error) : null))
		this.expressClient?.close()
		for (const client of this.wss.clients) client.terminate()
		console.log(`ChatBot ${this.name} stopped`)
	}

	/**
	 * Deletes the chat bot
	 */
	public delete() {
		this.stop()
		ChatBot.chatBots = ChatBot.chatBots.filter(bot => bot.id !== this.id)
	}
}
