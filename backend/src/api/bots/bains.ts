import { prisma } from "../.."
import ChatBot from "../../classes/ChatBot"
import { Request, Response } from "express"

/**
 * Route handler to get the brains: /api/v1/brains
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme
 * @param res Response body will contain an array of brains
 */
export async function brains(_req: Request, res: Response) {
	try {
		const brains = await prisma.brains.findMany()

		return res.status(200).send(brains)
	} catch (error) {
		return res.status(500).send({ error: "Internal Server Error" })
	}
}

/**
 * Route handler to get a bots current brain: /api/v1/brains/:id
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme
 * @param res Response body will contain the bots brain
 */
export async function brain(req: Request, res: Response) {
	try {
		const botId = req.params.id
		const bot = ChatBot.chatBots.find(bot => bot.getId() === botId)
		if (!bot) return res.status(404).send({ error: "Bot not found" })

		const brain = await bot.getBrain()

		return res.status(200).send(brain)
	} catch (error) {
		return res.status(500).send({ error: "Internal Server Error" })
	}
}
