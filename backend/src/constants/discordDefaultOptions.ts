import { ClientOptions, GatewayIntentBits, Partials } from "discord.js"

/**
 * Default options for the Discord bot
 */
export const discordDefaultOptions = {
	presence: { status: "online" },
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
	partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.User],
	failIfNotExists: false,
	allowedMentions: {
		parse: ["roles", "users"],
		repliedUser: false
	},
	shards: "auto"
} as ClientOptions
