import { Message } from "discord.js"
import { IChat } from "../../types/discord"
import ChatBot from "../../classes/ChatBot"

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

	chat.chatBot
		.getRivescriptBot()
		.reply(message.author.username, message.content)
		.then(reply => {
			message.reply(reply)
		})
}

export function changeChatBot(message: Message, chat: IChat) {
	const botName = message.content.slice("!bot".length).trim()
	if (botName === "") {
		message.reply("No bot name provided")
		return
	}

	const chatBot = ChatBot.chatBots.find(bot => bot.getName() === botName)
	if (!chatBot) {
		message.reply("Bot not found")
		return
	}

	chat.chatBot = chatBot
	message.reply(`Changed bot to ${botName}`)
}
