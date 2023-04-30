import { Request, Response } from "express"
import ChatBot from "../classes/ChatBot"

/**
 * Route handler to get the information about the bots: /api/v1/bots
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme
 * @param res Response body will contain information about the bots
 */
export async function getBots(_req: Request, res: Response) {
	try {
		const chatBotNames = ChatBot.chatBots.map(bot => {
			return {
				id: bot.getId(),
				name: bot.getName(),
				port: bot.getPort()
			}
		})

		return res.status(200).send(chatBotNames)
	} catch (error) {
		return res.status(500).send({ error: "Internal Server Error" })
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
		if (!bot) return res.status(404).send({ error: "Bot not found" })

		return res.status(200).send({
			id: bot.getId(),
			name: bot.getName(),
			port: bot.getPort()
		})
	} catch (error) {
		return res.status(500).send({ error: "Internal Server Error" })
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

		const bot = new ChatBot(botName)
		return res.status(200).send({
			id: bot.getId(),
			name: bot.getName(),
			port: bot.getPort()
		})
	} catch (error) {
		return res.status(500).send({ error: "Internal Server Error" })
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
		if (!bot) return res.status(404).send({ error: "Bot not found" })

		bot.delete()
		return res.status(200).send({ message: "Bot deleted" })
	} catch (error) {
		return res.status(500).send({ error: "Internal Server Error" })
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
		if (!bot) return res.status(404).send({ error: "Bot not found" })

		return res.status(200).send(bot.getBrain())
	} catch (error) {
		return res.status(500).send({ error: "Internal Server Error" })
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
		if (!bot) return res.status(404).send({ error: "Bot not found" })

		const brainName = req.params.brain
		const brain = await bot.setBrain(brainName)
		return res.status(200).send({
			botId: bot.getId(),
			brain,
			message: "Brain set"
		})
	} catch (error) {
		return res.status(500).send({ error: "Internal Server Error" })
	}
}
