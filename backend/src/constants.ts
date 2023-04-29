import { GatewayIntentBits, Partials, ClientOptions } from "discord.js"
import user from "./api/user"
import createUser from "./api/user/create"
import loginUser from "./api/user/login"
import type { Route } from "./types/express"

/**
 * Express routes
 */
export const routes: Route[] = [
	{
		method: "get",
		path: "/api/v1/user",
		handler: user
	},
	{
		method: "post",
		path: "/api/v1/user/create",
		handler: createUser
	},
	{
		method: "post",
		path: "/api/v1/user/login",
		handler: loginUser
	}
]

/**
 * Default options for the Discord bot
 */
export const discordDefaultOptions = {
	presence: {
		status: "online"
	},
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
	partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.User],
	failIfNotExists: false,
	allowedMentions: {
		parse: ["roles", "users"],
		repliedUser: false
	},
	shards: "auto"
} as ClientOptions
