export default async function createBot(token: string, name: string): Promise<Bot> {
	const res = await fetch(`/api/v1/bots/create/${name}`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`
		}
	})

	const data: BasicAPIResponse<Bot> = await res.json()
	if (data.type === "error") throw new Error(data.error)
	return data.data
}
