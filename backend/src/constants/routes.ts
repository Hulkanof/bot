import { getBot, getBots, createBot, deleteBot, getChats, getChatForUser, getChatForUserAndService, updateBotName } from "../api/bots"
import { createBrain, deleteBrain, getBrain, getBrains, modifyBrain } from "../api/brain"
import { createUser, loginUser, getUser, getUsers, updateAdmin } from "../api/user"
import { verifyToken } from "../middlewares/verifyToken"
import type { Route } from "../types/express"
import { verifyTokenAdmin } from "../middlewares/verifyTokenAdmin"
import { getBotbrain, setBotBrain } from "../api/bots"
import { getBotServices, setBotServices } from "../api/bots"
import { getServices, setService } from "../api/services"
import multer from "multer"

/**
 * Express routes
 */
export const routes: Route[] = [
	{
		// Get all users
		methods: ["get"],
		path: "/api/v1/users",
		middlewares: [],
		handler: getUsers
	},
	// ------------------ user Routes ------------------
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
	{
		// Change admin state of user
		methods: ["put"],
		path: "/api/v1/user/:id/admin",
		middlewares: [verifyTokenAdmin],
		handler: updateAdmin
	},
	// ------------------ bot Routes ------------------
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
		// Modify a bots name
		methods: ["patch"],
		path: "/api/v1/bots/:id/name/:name",
		middlewares: [verifyTokenAdmin],
		handler: updateBotName
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
	{
		// Get the service access for a bot
		methods: ["get"],
		path: "/api/v1/bots/:id/services",
		middlewares: [verifyToken],
		handler: getBotServices
	},
	{
		// Set the service access of a bot
		methods: ["put"],
		path: "/api/v1/bots/:id/services",
		middlewares: [verifyTokenAdmin],
		handler: setBotServices
	},
	{
		// Get the chats of a bot
		methods: ["get"],
		path: "/api/v1/bots/:id/chats",
		middlewares: [verifyTokenAdmin],
		handler: getChats
	},
	{
		// Get the chats of a person with a bot
		methods: ["get"],
		path: "/api/v1/bots/:id/chats/:author",
		middlewares: [verifyTokenAdmin],
		handler: getChatForUser
	},
	{
		// Get the chats of a person with a bot on a service
		methods: ["get"],
		path: "/api/v1/bots/:id/chats/:author/:service",
		middlewares: [verifyTokenAdmin],
		handler: getChatForUserAndService
	},
	// ------------------ brain Routes ------------------
	{
		// Get all brains
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
	},
	{
		// Add a new brain
		methods: ["post"],
		path: "/api/v1/brains/create/:name",
		middlewares: [multer().single("files"), verifyTokenAdmin],
		handler: createBrain
	},
	{
		// Delete a brain
		methods: ["delete"],
		path: "/api/v1/brains/delete/:id",
		middlewares: [verifyTokenAdmin],
		handler: deleteBrain
	},
	{
		// Modify a brain
		methods: ["put"],
		path: "/api/v1/brains/modify/:id",
		middlewares: [verifyTokenAdmin],
		handler: modifyBrain
	},
	// ------------------ services Routes ------------------
	{
		/*
		 * Get the general configuration validation value
		 * Response contains an object of services with boolean values, true if the configuration is ok
		 */
		methods: ["get"],
		path: "/api/v1/services",
		middlewares: [verifyToken],
		handler: getServices
	},
	{
		methods: ["put"],
		path: "/api/v1/services/:name",
		middlewares: [verifyTokenAdmin],
		handler: setService
	}
]
