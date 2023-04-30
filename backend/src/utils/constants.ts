import { ClientOptions, GatewayIntentBits, Partials } from "discord.js"
import { getBot, getBots, createBot, deleteBot } from "../api/bots"
import { getBrain, getBrains } from "../api/brain"
import { createUser, loginUser, getUser } from "../api/user"
import { verifyToken } from "../middlewares/verifyToken"
import type { Route } from "../types/express"
import { verifyTokenAdmin } from "../middlewares/verifyTokenAdmin"
import { getBotbrain, setBotBrain } from "../api/bots"

/**
 * Express routes
 */
export const routes: Route[] = [
	// --------- user Routes ---------
	{
		// Get user data from JWT token
		methods: ["get"],
		path: "/api/v1/user",
		handler: getUser
	},
	{
		// Create a new user account and return a JWT token
		methods: ["post"],
		path: "/api/v1/user/create",
		handler: createUser
	},
	{
		// Login to an existing user account and return a JWT token
		methods: ["post"],
		path: "/api/v1/user/login",
		handler: loginUser
	},
	// --------- bot Routes ---------
	{
		// Get information about all bots
		methods: ["get"],
		path: "/api/v1/bots",
		middlewares: [verifyToken],
		handler: getBots
	},
	{
		// Get information about a specific bot
		methods: ["get"],
		path: "/api/v1/bots/:id",
		middlewares: [verifyToken],
		handler: getBot
	},
	{
		// Create a new bot
		methods: ["post"],
		path: "/api/v1/bots/create/:name",
		middlewares: [verifyTokenAdmin],
		handler: createBot
	},
	{
		// delete a bot
		methods: ["delete"],
		path: "/api/v1/bots/delete/:id",
		middlewares: [verifyTokenAdmin],
		handler: deleteBot
	},
	{
		// Get the brain of a bot
		methods: ["get"],
		path: "/api/v1/bots/:id/brain",
		middlewares: [verifyToken],
		handler: getBotbrain
	},
	{
		// Change the brain of a bot
		methods: ["put"],
		path: "/api/v1/bots/:id/brain/:brain",
		middlewares: [verifyTokenAdmin],
		handler: setBotBrain
	},
	// --------- brain Routes ---------
	{
		// Get all brains or a specific brain if bot id is provided
		methods: ["get"],
		path: "/api/v1/brains",
		middlewares: [verifyToken],
		handler: getBrains
	},
	{
		// Get a specific brain
		methods: ["get"],
		path: "/api/v1/brains/:id",
		middlewares: [verifyToken],
		handler: getBrain
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
