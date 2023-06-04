import { Message } from "discord.js"
import { IChat } from "../../types/discord"
import ChatBot from "../../classes/ChatBot"

/**
 * Handler for discord chat messages to the bot
 * @param chats Map of chats
 * @param message Message object
 * @param chat Chat object
 */
export async function handlePrivateChat(chats: Map<string, IChat[]>, message: Message, chat: IChat) {
	if (message.content === "!stop") {
		message.channel.delete()
		chats.delete(message.author.id)
		return
	}

	if (message.content.startsWith("!bot")) {
		changeChatBot(message, chat)
		return
	}

	if (!chat.chatBot) {
		message.reply("Please select a bot first")
		return
	}

	const name = chat.chatBot.getName()

	chat.chatBot
		.getRivescriptBot()
		.reply(message.author.username, message.content)
		.then(reply => {
			message.reply(reply)
			if (!ChatBot.conversations) ChatBot.conversations = {}
			if (!ChatBot.conversations[message.author.username]) ChatBot.conversations[message.author.username] = []
			ChatBot.conversations[message.author.username].push({
				chatBotName: name,
				author: message.author.username,
				service: "discord",
				question: message.content,
				answer: reply
			})
		})
}

export function changeChatBot(message: Message, chat: IChat) {
	const botName = message.content.slice("!bot".length).trim()
	if (botName === "") return message.reply("No bot name provided")

	const chatBot = ChatBot.chatBots.find(bot => bot.getName() === botName)
	if (!chatBot) return message.reply("Bot not found")

	if (chatBot.serviceAccess["discord"] === false) return message.reply("This bot is not available on Discord")
	chat.chatBot = chatBot
	message.reply(`Changed bot to ${botName}`)
}
