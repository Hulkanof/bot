import { PrismaClient } from "@prisma/client"
import ExpressClient from "./classes/ExpressClient"
import discordConfig from "./config/discord.json"
import DiscordBot from "./classes/DiscordBot"
import { exit } from "process"
import type { DiscordClientConfig } from "./types/discord"
import initDB from "./utils/initDB"
import { routes } from "./constants/routes"
import createChatBots from "./utils/createChatBots"
import ChatBot from "./classes/ChatBot"
import path from "path"
import fs from "fs"
require("dotenv").config()

let discordConfigOK = discordConfig.token && discordConfig.clientId && discordConfig.clientSecret
let mastodonConfigOK = false
let slackConfigOK = false

// Check for required environment variables
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set")
if (!process.env.TOKEN_SECRET) throw new Error("TOKEN_SECRET not set")
if (!discordConfigOK) console.warn("Incorrect Discord config!")
if (!mastodonConfigOK) console.warn("Incorrect Mastodon Config!")
if (!slackConfigOK) console.warn("Incorrect Slack Config!")

let environment = {
	DATABASE_URL: process.env.DATABASE_URL,
	JWT_SECRET: process.env.TOKEN_SECRET,
	PORT: 4000,
	discordConfigOK: !!discordConfigOK,
	mastodonConfigOK: !!mastodonConfigOK,
	slackConfigOK: !!slackConfigOK
}

// Prisma Client
const prisma = new PrismaClient({ errorFormat: "pretty" })
initDB()

// Discord Client
let discordBot: DiscordBot | undefined
if (discordConfigOK) {
	const config = discordConfig as DiscordClientConfig
	discordBot = new DiscordBot(config)
}

function changeDiscordBot() {
	const discordPath = path.join(__dirname, "./config/discord.json")
	const buffer = fs.readFileSync(discordPath)
	const newDiscordConfig = JSON.parse(buffer.toString())
	discordConfigOK = newDiscordConfig.token && newDiscordConfig.clientId && newDiscordConfig.clientSecret
	if (discordBot) discordBot.stop()
	if (discordConfigOK) {
		const config = newDiscordConfig as DiscordClientConfig
		discordBot = new DiscordBot(config)
	}

	environment = {
		...environment,
		discordConfigOK: !!discordConfigOK
	}
}

// Express Client
const expressClient = new ExpressClient(routes, 4000, true)
createChatBots()

// Graceful Shutdown
process.on("SIGTERM", async () => {
	console.log("Gracefully shutting down!")
	expressClient.close()
	for (const chatBot of ChatBot.chatBots) chatBot.stop()
	if (discordBot) await discordBot.stop()
	exit(0)
})

process.on("SIGINT", async () => {
	console.log("Gracefully shutting down!")
	expressClient.close()
	for (const chatBot of ChatBot.chatBots) chatBot.stop()
	if (discordBot) await discordBot.stop()
	exit(0)
})

export { discordBot, expressClient, prisma, environment, changeDiscordBot }
