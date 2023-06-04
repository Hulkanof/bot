import ChatBot from "../classes/ChatBot"
import { prisma, setBotsReady } from "../main"

/**
 * Create all bots found in the database
 */
export default async function createChatBots() {
	// Create bots found in the database
	const dBbots = await prisma.bots.findMany()
	for (const dBbot of dBbots) {
		new ChatBot(dBbot.id, dBbot.name, dBbot.brain, dBbot.serviceAccess)
	}
	setBotsReady(true)
}
