/**
 * Gets all getBrains
 * @param token The user's token
 * @returns A list of brains
 * @throws Error if the request fails
 */
export default async function getBrains(token: string): Promise<Brain[]> {
	const response = await fetch(`/api/v1/brains`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`
		}
	})

	const data: BasicAPIResponse<Brain[]> = await response.json()
	if (data.type === "error") throw new Error(data.error)
	return data.data
}
