/**
 * This function modifies a brain.
 * @param token The user token
 * @param brainId The id of the brain
 * @param brain The brain to create
 * @returns The modified brain
 * @throws Error if the request fails
 */
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
