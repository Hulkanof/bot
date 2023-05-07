import type { Request, Response } from "express"
import { environment, changeDiscordBot } from "../main"
import fs from "fs"
import path from "path"

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

export async function setService(req: Request, res: Response) {
	const name = req.params.name
	const data = req.body

	if (!name) return res.status(400).send({ type: "error", error: "No service name provided" })
	if (!data) return res.status(400).send({ type: "error", error: "No data provided" })

	try {
		switch (name) {
			case "discord":
				const discordPath = path.join(__dirname, "../config/discord.json")
				const buffer = fs.readFileSync(discordPath)
				const discordConfig = JSON.parse(buffer.toString())

				fs.writeFileSync(
					discordPath,
					JSON.stringify({
						clientId: data.clientId ? data.clientId : discordConfig.clientId,
						clientSecret: data.clientSecret ? data.clientSecret : discordConfig.clientSecret,
						token: data.token ? data.token : discordConfig.token,
						prefix: data.prefix ? data.prefix : discordConfig.prefix
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
				break
			default:
				return res.status(404).send({ type: "error", error: "Service not found" })
		}
		res.status(400).send({ type: "error", error: "Not implemented yet" })
	} catch (error) {
		console.log(error)
		res.status(500).send({ type: "error", error: "Internal Server Error" })
	}
}
