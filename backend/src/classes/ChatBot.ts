/**
 * Instance of a chat bot
 */
export default class ChatBot {
	private name: string

	constructor(name: string, token: string) {
		this.name = name

		// bots.push(this)
	}

	public getName(): string {
		return this.name
	}
}
