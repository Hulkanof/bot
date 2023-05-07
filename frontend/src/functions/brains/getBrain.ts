export default async function getBrain(token: string, brainId: string): Promise<Brain> {
	const response = await fetch(`/api/v1/brains/${brainId}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`
		}
	})
	const data: BasicAPIResponse<Brain> = await response.json()
	if (data.type === "error") throw new Error(data.error)
	return data.data
}
