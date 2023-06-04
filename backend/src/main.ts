import { PrismaClient } from "@prisma/client"
import ExpressClient from "./classes/ExpressClient"
import discordConfig from "./config/discord.json"
import mastodonConfig from "./config/mastodon.json"
import slackConfig from "./config/slack.json"
import Mastodon from "./classes/Mastodon"
import DiscordBot from "./classes/DiscordBot"
import { exit } from "process"
import type { DiscordClientConfig } from "./types/discord"
import initDB from "./utils/initDB"
import { routes } from "./constants/routes"
import createChatBots from "./utils/createChatBots"
import ChatBot from "./classes/ChatBot"
import SlackClient from "./classes/SlackClient"
import path from "path"
import fs from "fs"
import { MastoConfigProps } from "masto"
require("dotenv").config()

let discordConfigOK = discordConfig.token && discordConfig.clientId && discordConfig.clientSecret
let mastodonConfigOK = mastodonConfig.url && mastodonConfig.token
let slackConfigOK = slackConfig.signingSecret && slackConfig.token && slackConfig.appToken

// Check for required environment variables
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set")
if (!process.env.TOKEN_SECRET) throw new Error("TOKEN_SECRET not set")
if (!discordConfigOK) console.warn("Incorrect Discord config!")
if (!mastodonConfigOK) console.warn("Incorrect Mastodon Config!")
if (!slackConfigOK) console.warn("Incorrect Slack Config!")

let botsReady = false

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
	try {
		const config = discordConfig as DiscordClientConfig
		discordBot = new DiscordBot(config)
	} catch (err) {
		console.error("Error creating Discord client:", err)
	}
}

// Mastodon Client
let mastodonBot: Mastodon | undefined
if (mastodonConfigOK) {
	const config = {
		url: mastodonConfig.url,
		accessToken: mastodonConfig.token
	} satisfies MastoConfigProps

	mastodonBot = new Mastodon(config)
}

// Slack Client
let slackBot: SlackClient | undefined
if (slackConfigOK) {
	try {
		slackBot = new SlackClient(slackConfig.signingSecret, slackConfig.token, slackConfig.appToken)
	} catch (err) {
		console.error("Error creating Slack client:", err)
	}
}

/**
 * Change Discord Bot and restarts it
 */
function changeDiscordBot() {
	const discordPath = path.join(__dirname, "./config/discord.json")
	const buffer = fs.readFileSync(discordPath)
	const newDiscordConfig = JSON.parse(buffer.toString())
	discordConfigOK = newDiscordConfig.token && newDiscordConfig.clientId && newDiscordConfig.clientSecret
	if (discordBot) discordBot.stop()
	if (discordConfigOK) {
		try {
			const config = newDiscordConfig as DiscordClientConfig
			discordBot = new DiscordBot(config)
		} catch (err) {
			console.error("Error creating Discord client:", err)
		}
	} else {
		discordBot = undefined
		console.warn("Incorrect Discord config!")
	}

	environment = {
		...environment,
		discordConfigOK: !!discordConfigOK
	}
}

/**
 * Change Slack Bot and restarts it
 */
function changeSlackBot() {
	const slackPath = path.join(__dirname, "./config/slack.json")
	const buffer = fs.readFileSync(slackPath)
	const slackConfig = JSON.parse(buffer.toString())
	slackConfigOK = slackConfig.signingSecret && slackConfig.token
	if (slackBot) slackBot.stop()
	if (slackConfigOK) {
		try {
			slackBot = new SlackClient(slackConfig.signingSecret, slackConfig.token, slackConfig.appToken)
		} catch (err) {
			console.error("Error creating Slack client:", err)
		}
	} else {
		slackBot = undefined
		console.warn("Incorrect Slack Config!")
	}

	environment = {
		...environment,
		slackConfigOK: !!slackConfigOK
	}
}

// Express Client
const expressClient = new ExpressClient(routes, 4000, { start: true })
createChatBots()

function setBotsReady(ready: boolean) {
	botsReady = ready
}

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

process.on("unhandledRejection", error => {
	console.log("unhandledRejection", error)
})

export { discordBot, slackBot, botsReady, expressClient, prisma, environment, changeDiscordBot, changeSlackBot, setBotsReady }
