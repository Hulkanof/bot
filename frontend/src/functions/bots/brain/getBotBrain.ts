/**
 * Get the brain of a bot
 * @param token The user token
 * @param botId The id of the bot
 * @returns The brain of the bot
 * @throws Error if the request fails
 */
export default async function getBotBrain(token: string, botId: string): Promise<Brain> {
	const res = await fetch(`/api/v1/bots/${botId}/brain`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`
		}
	})

	const data: BasicAPIResponse<Brain> = await res.json()
	if (data.type === "error") throw new Error(data.error)
	return data.data
}
