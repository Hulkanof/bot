export default async function changeBotServices(token: string, botId: string, services: ServiceAccess): Promise<ServiceAccess> {
	const response = await fetch(`/api/v1/bots/${botId}/services`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(services)
	})

	const data: BasicAPIResponse<ServiceAccess> = await response.json()
	if (data.type === "error") throw new Error(data.error)
	return data.data
}
