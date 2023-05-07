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
