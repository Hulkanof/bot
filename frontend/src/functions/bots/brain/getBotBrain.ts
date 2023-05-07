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
