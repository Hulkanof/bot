/**
 * Sends a request to delete a bot
 * @param token The user token
 * @param botId The id of the bot
 * @returns A message
 * @throws Error if the request fails
 */
export default async function deleteBot(token: string, botId: string): Promise<string> {
	const res = await fetch(`/api/v1/bots/delete/${botId}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`
		}
	})

	const data: BasicAPIResponse<null> = await res.json()
	if (data.type === "error") throw new Error(data.error)
	return data.message
}
