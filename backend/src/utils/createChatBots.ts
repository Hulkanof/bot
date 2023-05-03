import ChatBot from "../classes/ChatBot"
import { prisma } from "../main"

export default async function initDB() {
	// Create bots found in the database
	const dBbots = await prisma.bots.findMany()
	for (const dBbot of dBbots) {
		new ChatBot(dBbot.id, dBbot.name, dBbot.brain, dBbot.serviceAccess)
	}
}
