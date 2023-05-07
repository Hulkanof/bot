/**
 * This function gets the services that a bot has access to.
 * @param token The user token
 * @param botId The id of the bot
 * @returns The services of the bot
 * @throws Error if the request fails
 */
export default async function getBotServices(token: string, botId: string): Promise<ServiceAccess> {
	const response = await fetch(`/api/v1/bots/${botId}/services`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`
		}
	})

	const data: BasicAPIResponse<ServiceAccess> = await response.json()
	if (data.type === "error") throw new Error(data.error)
	return data.data
}
