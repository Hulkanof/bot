/**
 * This function is used to get a bot from the API
 * @param token The user token
 * @param botId The id of the bot
 * @returns The bot
 * @throws Error if the request fails
 */
export default async function getBot(token: string, botId: string): Promise<Bot> {
	const res = await fetch(`/api/v1/bots/${botId}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`
		}
	})

	const data: BasicAPIResponse<Bot> = await res.json()
	if (data.type === "error") throw new Error(data.error)
	return data.data
}
