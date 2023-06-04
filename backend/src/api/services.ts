import type { Request, Response } from "express"
import { environment, changeDiscordBot, changeSlackBot, discordBot, slackBot } from "../main"
import fs from "fs"
import path from "path"

/**
 * Route to get the services available: /api/services
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme
 * @param res Response body will contain the available services
 */
export async function getServices(_req: Request, res: Response) {
	const availableServices = {
		discord: environment.discordConfigOK,
		mastodon: environment.mastodonConfigOK,
		slack: environment.slackConfigOK
	}

	res.status(200).send({
		type: "success",
		data: availableServices
	})
}

/**
 * Route to get a specific service: /api/services/:name
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme
 * @param res Response body will contain the service data
 */
export async function setService(req: Request, res: Response) {
	const name = req.params.name
	const data = req.body

	if (!name) return res.status(400).send({ type: "error", error: "No service name provided" })
	if (!data) return res.status(400).send({ type: "error", error: "No data provided" })

	try {
		switch (name) {
			case "discord":
				if (discordBot && !discordBot.isReady()) return res.status(400).send({ type: "error", error: "Discord bot not ready" })
				const discordPath = path.join(__dirname, "../config/discord.json")
				const buffer = fs.readFileSync(discordPath)
				const discordConfig = JSON.parse(buffer.toString())

				fs.writeFileSync(
					discordPath,
					JSON.stringify({
						clientId: data.clientId ? data.clientId : discordConfig.clientId || "",
						clientSecret: data.clientSecret ? data.clientSecret : discordConfig.clientSecret || "",
						token: data.token ? data.token : discordConfig.token || "",
						prefix: data.prefix ? data.prefix : discordConfig.prefix || ""
					})
				)

				changeDiscordBot()

				return res.status(200).send({
					type: "success",
					message: "Discord config updated"
				})
			case "mastodon":
				break
			case "slack":
				if (slackBot && slackBot.isReady()) return res.status(400).send({ type: "error", error: "Slack bot not ready" })
				const slackPath = path.join(__dirname, "../config/slack.json")
				const slackBuffer = fs.readFileSync(slackPath)
				const slackConfig = JSON.parse(slackBuffer.toString())

				fs.writeFileSync(
					slackPath,
					JSON.stringify({
						signingSecret: data.signingSecret ? data.signingSecret : slackConfig.signingSecret,
						token: data.token ? data.token : slackConfig.token,
						appToken: data.appToken ? data.appToken : slackConfig.appToken
					})
				)
				changeSlackBot()

				return res.status(200).send({
					type: "success",
					message: "Slack config updated"
				})
			default:
				return res.status(404).send({ type: "error", error: "Service not found" })
		}
		res.status(400).send({ type: "error", error: "Not implemented yet" })
	} catch (error) {
		console.log(error)
		res.status(500).send({ type: "error", error: "Internal Server Error" })
	}
}
