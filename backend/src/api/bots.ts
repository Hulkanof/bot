import { Request, Response } from "express"
import ChatBot from "../classes/ChatBot"
import { prisma } from "../main"
import { ServiceAccess } from "@prisma/client"

/**
 * Route handler to get the information about the bots: /api/v1/bots
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme
 * @param res Response body will contain information about the bots
 */
export async function getBots(_req: Request, res: Response) {
	try {
		const chatBots = await Promise.all(
			ChatBot.chatBots.map(async bot => {
				const brain = await bot.getBrain()
				return {
					id: bot.getId(),
					name: bot.getName(),
					brain: {
						id: brain.id,
						name: brain.name
					},
					serviceAccess: bot.serviceAccess,
					socketPort: bot.getPort()
				}
			})
		)

		return res.status(200).send({
			type: "success",
			data: chatBots
		})
	} catch (error) {
		return res.status(500).send({ type: "error", error: "Internal Server Error" })
	}
}

/**
 * Route handler to get the information about a specific bot: /api/v1/bots/:id
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme
 * @param res Response body will contain information about the bot
 */
export async function getBot(req: Request, res: Response) {
	try {
		const botId = req.params.id
		const bot = ChatBot.chatBots.find(bot => bot.getId() === botId)
		if (!bot) return res.status(404).send({ type: "error", error: "Bot not found" })

		const brain = await bot.getBrain()

		return res.status(200).send({
			type: "success",
			data: {
				id: bot.getId(),
				name: bot.getName(),
				brain: {
					id: brain.id,
					name: brain.name
				},
				serviceAccess: bot.serviceAccess,
				socketPort: bot.getPort()
			}
		})
	} catch (error) {
		return res.status(500).send({ type: "error", error: "Internal Server Error" })
	}
}

/**
 * Route handler to create a new bot: /api/v1/bots/create/:name
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme
 * @param res Response body will contain information about the bot
 */
export async function createBot(req: Request, res: Response) {
	try {
		const botName = req.params.name
		if (ChatBot.chatBots.some(bot => bot.getName() === botName)) return res.status(409).send({ error: "Bot already exists" })

		const serviceAccess = {
			discord: false,
			mastodon: false,
			slack: false,
			socket: false
		}

		const dbBot = await prisma.bots.create({
			data: {
				name: botName,
				brain: "standard.rive",
				serviceAccess
			}
		})

		const bot = new ChatBot(dbBot.id, dbBot.name, dbBot.brain, dbBot.serviceAccess)

		const brain = await prisma.brains.findUnique({
			where: {
				name: "standard.rive"
			}
		})
		if (!brain) return res.status(500).send({ type: "error", error: "Internal Server Error" })

		return res.status(200).send({
			type: "success",
			data: {
				id: bot.getId(),
				name: bot.getName(),
				brain: {
					id: brain.id,
					name: brain.name
				},
				serviceAccess: bot.serviceAccess,
				socketPort: bot.getPort()
			}
		})
	} catch (error) {
		return res.status(500).send({ type: "error", error: "Internal Server Error" })
	}
}

/**
 * Route handler to update the name of a bot: /api/v1/bots/update/:id/:name
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme
 * @param res Response body will contain information about the bot
 */
export async function updateBotName(req: Request, res: Response) {
	try {
		const botId = req.params.id
		const bot = ChatBot.chatBots.find(bot => bot.getId() === botId)
		if (!bot) return res.status(404).send({ type: "error", error: "Bot not found" })

		const newName = req.params.name

		if (!newName || newName === "") return res.status(400).send({ type: "error", error: "No new name provided" })

		const dbBot = await prisma.bots.findMany({
			where: {
				name: newName
			}
		})
		if (dbBot.length > 0) return res.status(409).send({ type: "error", error: "Bot already exists" })

		await prisma.bots.update({
			where: {
				id: botId
			},
			data: {
				name: newName
			}
		})

		bot.setName(newName)

		return res.status(200).send({ type: "success", message: "Bot name updated" })
	} catch (error) {
		return res.status(500).send({ type: "error", error: "Internal Server Error" })
	}
}

/**
 * Route handler to delete a bot: /api/v1/bots/delete/:id
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme
 * @param res Response body will contain information about the bot
 */
export async function deleteBot(req: Request, res: Response) {
	try {
		const botId = req.params.id
		const bot = ChatBot.chatBots.find(bot => bot.getId() === botId)
		if (!bot) return res.status(404).send({ type: "error", error: "Bot not found" })

		bot.delete()

		await prisma.bots.delete({
			where: {
				id: botId
			}
		})

		return res.status(200).send({ type: "success", message: "Bot deleted" })
	} catch (error) {
		return res.status(500).send({ type: "error", error: "Internal Server Error" })
	}
}

/**
 * Route handler to get the brain of a bot: /api/v1/bots/:id/brain
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme
 * @param res Response body will contain the brain of the bot
 */
export async function getBotbrain(req: Request, res: Response) {
	try {
		const botId = req.params.id
		const bot = ChatBot.chatBots.find(bot => bot.getId() === botId)
		if (!bot) return res.status(404).send({ type: "error", error: "Bot not found" })

		const brain = await bot.getBrain()

		return res.status(200).send({
			type: "success",
			data: brain
		})
	} catch (error) {
		return res.status(500).send({ type: "error", error: "Internal Server Error" })
	}
}

/**
 * Route handler to set the brain of a bot: /api/v1/bots/:id/brain/:brain
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme
 * @param res Response body will contain the brain of the bot
 */
export async function setBotBrain(req: Request, res: Response) {
	try {
		const botId = req.params.id
		const bot = ChatBot.chatBots.find(bot => bot.getId() === botId)
		if (!bot) return res.status(404).send({ type: "error", error: "Bot not found" })

		const brainName = req.params.brain
		const brain = await bot.setBrain(brainName)

		await prisma.bots.update({
			where: {
				id: botId
			},
			data: {
				brain: brainName
			}
		})

		return res.status(200).send({
			type: "success",
			data: {
				botId: bot.getId(),
				brain,
				message: "Brain set"
			}
		})
	} catch (error) {
		return res.status(500).send({ type: "error", error: "Internal Server Error" })
	}
}

/**
 * Route handler to get the service access of a bot: /api/v1/bots/:id/services
 * @param req Request must contain a valid JWT token in the Authorization heaer with the Bearer scheme
 * @param res Response body will contain the service access of the bot
 */
export async function getBotServices(req: Request, res: Response) {
	const botId = req.params.id
	const bot = ChatBot.chatBots.find(bot => bot.getId() === botId)
	if (!bot) return res.status(404).send({ type: "error", error: "Bot not found" })

	res.status(200).send({
		type: "success",
		data: bot.serviceAccess
	})
}

/**
 * Route handle to set the service access of a bot: /api/v1/bot/:id/services
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme
 * @param res Response body will contain the new access for the bot
 */
export async function setBotServices(req: Request, res: Response) {
	try {
		const botId = req.params.id
		const bot = ChatBot.chatBots.find(bot => bot.getId() === botId)
		if (!bot) return res.status(404).send({ type: "error", error: "Bot not found" })

		const services = req.body?.services as Partial<ServiceAccess>
		if (!services) return res.status(400).send({ type: "error", error: "Body was not set correctly" })

		const serviceAccess = {
			discord: services.discord !== undefined ? services.discord : bot.serviceAccess.discord,
			mastodon: services.mastodon !== undefined ? services.mastodon : bot.serviceAccess.mastodon,
			slack: services.slack !== undefined ? services.slack : bot.serviceAccess.slack,
			socket: services.socket !== undefined ? services.socket : bot.serviceAccess.socket
		}

		const dbServiceAccess = await prisma.bots.update({
			where: {
				id: botId
			},
			data: {
				serviceAccess
			}
		})

		if (!dbServiceAccess) return res.status(500).send({ type: "error", error: "Data could not be set in the database" })

		bot.serviceAccess = dbServiceAccess.serviceAccess

		res.status(200).send({
			type: "success",
			data: bot.serviceAccess
		})
	} catch (error) {
		console.error(error)
		return res.status(500).send({ type: "error", error: "Internal Error" })
	}
}

/**
 * Route handler to get the conversations of a bot: /api/v1/bots/:id/chats
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme
 * @param res Response body will contain the conversations of the bot
 */
export function getChats(req: Request, res: Response) {
	const botId = req.params.id
	const bot = ChatBot.chatBots.find(bot => bot.getId() === botId)
	if (!bot) return res.status(404).send({ type: "error", error: "Bot not found" })

	const sortedConversations: typeof ChatBot.conversations = {}
	if (ChatBot.conversations)
		for (const [_author, conversation] of Object.entries(ChatBot.conversations)) {
			conversation.forEach(c => {
				if (c.chatBotName !== bot.getName()) return
				if (!sortedConversations[c.author]) sortedConversations[c.author] = []
				sortedConversations[c.author].push(c)
			})
		}

	res.status(200).send({
		type: "success",
		data: sortedConversations
	})
}

/**
 * Route handler to get the conversations of a bot: /api/v1/bots/:id/chats/:author
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme
 * @param res Response body will contain the conversations of the bot
 */
export async function getChatForUser(req: Request, res: Response) {
	const botId = req.params.id
	const bot = ChatBot.chatBots.find(bot => bot.getId() === botId)
	if (!bot) return res.status(404).send({ type: "error", error: "Bot not found" })
	const reqAuthor = req.params.author

	const sortedConversations: typeof ChatBot.conversations = {}
	if (ChatBot.conversations)
		for (const [author, conversation] of Object.entries(ChatBot.conversations)) {
			if (author !== reqAuthor) continue
			conversation.forEach(c => {
				if (c.chatBotName !== bot.getName()) return
				if (!sortedConversations[c.author]) sortedConversations[c.author] = []
				sortedConversations[c.author].push(c)
			})
		}

	res.status(200).send({
		type: "success",
		data: sortedConversations
	})
}

/**
 * Route handler to get the conversations of a bot: /api/v1/bots/:id/chats/:author/:service
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme
 * @param res Response body will contain the conversations of the bot
 */
export function getChatForUserAndService(req: Request, res: Response) {
	const botId = req.params.id
	const bot = ChatBot.chatBots.find(bot => bot.getId() === botId)
	if (!bot) return res.status(404).send({ type: "error", error: "Bot not found" })

	const reqAuthor = req.params.author
	const service = req.params.service

	const sortedConversations: typeof ChatBot.conversations = {}
	if (ChatBot.conversations)
		for (const [author, conversation] of Object.entries(ChatBot.conversations)) {
			if (author !== reqAuthor) continue
			conversation.forEach(c => {
				if (c.chatBotName !== bot.getName()) return
				if (typeof c.service === "string" ? c.service !== service : c.service.name !== service) return
				if (!sortedConversations[c.author]) sortedConversations[c.author] = []
				sortedConversations[c.author].push(c)
			})
		}

	res.status(200).send({
		type: "success",
		data: sortedConversations
	})
}
