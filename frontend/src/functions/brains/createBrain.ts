/**
 * This function creates a brain
 * @param token The user token
 * @param brain The brain to create
 * @returns The created brain
 * @throws Error if the request fails
 */
export default async function createBrain(token: string, brain: { file: File; name: string }): Promise<Brain> {
	const formData = new FormData()
	formData.append("name", brain.name)
	formData.append("files", brain.file)
	const response = await fetch(`/api/v1/brains/create/${brain.name}`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData
	})

	const data: BasicAPIResponse<Brain> = await response.json()
	if (data.type === "error") throw new Error(data.error)
	return data.data
}
