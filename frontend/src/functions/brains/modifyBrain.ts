export default async function modifyBrain(token: string, brainId: string, brain: Omit<Brain, "id">): Promise<Brain> {
	const response = await fetch(`/api/v1/brains/${brainId}`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			name: brain.name,
			data: brain.data
		})
	})

	const data: BasicAPIResponse<Brain> = await response.json()
	if (data.type === "error") throw new Error(data.error)
	return data.data
}
