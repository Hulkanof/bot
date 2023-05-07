/**
 * Send a request to change the brain of a bot
 * @param token The user token
 * @param BotId The id of the bot
 * @param brainName The name of the brain to change to
 * @returns The new brain
 * @throws Error if the request fails
 */
export default async function changeBotBrain(token: string, BotId: string, brainName: string): Promise<Brain> {
	const res = await fetch(`/api/v1/bots/${BotId}/brain/${brainName}`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`
		}
	})

	const data: BasicAPIResponse<Brain> = await res.json()
	if (data.type === "error") throw new Error(data.error)
	return data.data
}
