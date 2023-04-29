import { ClientOptions, GatewayIntentBits, Partials } from "discord.js"
import { bot, bots } from "../api/bots"
import { brain, brains } from "../api/bots/bains"
import { createUser, loginUser, user } from "../api/user"
import { verifyToken } from "../middlewares/verifyToken"
import type { Route } from "../types/express"

/**
 * Express routes
 */
export const routes: Route[] = [
	// --------- user Routes ---------
	{
		// Get user data from JWT token
		method: "get",
		path: "/api/v1/user",
		handler: user
	},
	{
		// Create a new user account and return a JWT token
		method: "post",
		path: "/api/v1/user/create",
		handler: createUser
	},
	{
		// Login to an existing user account and return a JWT token
		method: "post",
		path: "/api/v1/user/login",
		handler: loginUser
	},
	// --------- bot Routes ---------
	{
		// Get information about all bots
		method: "get",
		path: "/api/v1/bots",
		middlewares: [verifyToken],
		handler: bots
	},
	{
		// Get information about a specific bot
		method: "get",
		path: "/api/v1/bots/:id",
		middlewares: [verifyToken],
		handler: bot
	},
	// --------- brain Routes ---------
	{
		// Get all brains
		method: "get",
		path: "/api/v1/brains",
		middlewares: [verifyToken],
		handler: brains
	},
	{
		// Get the brain of a specific bot
		method: "get",
		path: "/api/v1/brains/:id",
		middlewares: [verifyToken],
		handler: brain
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
