import { Request, Response } from "express"
import ChatBot from "../../classes/ChatBot"

/**
 * Route handler to get the information about the bots: /api/v1/bots
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme
 * @param res Response body will contain information about the bots
 */
export async function bots(_req: Request, res: Response) {
	try {
		const chatBotNames = ChatBot.chatBots.map(bot => {
			return {
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
export async function bot(req: Request, res: Response) {
	try {
		const botId = req.params.id
		const bot = ChatBot.chatBots.find(bot => bot.getId() === botId)
		if (!bot) return res.status(404).send({ error: "Bot not found" })

		return res.status(200).send({
			name: bot.getName(),
			port: bot.getPort()
		})
	} catch (error) {
		return res.status(500).send({ error: "Internal Server Error" })
	}
}
