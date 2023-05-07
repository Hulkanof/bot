export default async function deleteBot(token: string, botId: string) {
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
