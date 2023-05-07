export default async function deleteBrain(token: string, brainId: string): Promise<string> {
	const response = await fetch(`/api/v1/brains/${brainId}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`
		}
	})

	const data: BasicAPIResponse<null> = await response.json()
	if (data.type === "error") throw new Error(data.error)
	return data.message
}
