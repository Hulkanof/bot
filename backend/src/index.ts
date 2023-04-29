import { PrismaClient } from "@prisma/client"
import ExpressClient from "./classes/ExpressClient"
import { routes } from "./constants"
import discordConfig from "./config/discord.json"
import DiscordBot from "./classes/DiscordBot"
import { exit } from "process"
import type { DiscordClientConfig } from "./types/discord"
require("dotenv").config()

const discordConfigOK = discordConfig.token && discordConfig.clientId && discordConfig.clientSecret

// Check for required environment variables
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set")
if (!process.env.TOKEN_SECRET) throw new Error("TOKEN_SECRET not set")
if (!discordConfigOK) console.warn("Incorrect Discord config!")
if (!process.env.PORT) console.warn("PORT not set, using default 4000")

// Prisma client
const prisma = new PrismaClient({ errorFormat: "pretty" })

// Discord client
let discordBot: DiscordBot | undefined
if (discordConfigOK) {
	const config = discordConfig as DiscordClientConfig
	discordBot = new DiscordBot(config)
}

// Express client
const expressClient = new ExpressClient(routes, parseInt(process.env.PORT || "4000"))

// Graceful shutdown
process.on("SIGTERM", async () => {
	console.log("Gracefully shutting down!")
	expressClient.close()
	if (discordBot) discordBot.stop()
	exit(0)
})

process.on("SIGINT", async () => {
	console.log("Gracefully shutting down!")
	expressClient.close()
	if (discordBot) discordBot.stop()
	exit(0)
})

export { discordBot, expressClient, prisma }
