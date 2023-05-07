/**
 * Get available services
 * @param token The user token
 * @returns The available services
 * @throws Error if the request fails
 */
export default async function getAvailableServices(token: string): Promise<AvailableServices> {
	const response = await fetch(`/api/v1/services`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`
		}
	})

	const data: BasicAPIResponse<AvailableServices> = await response.json()
	if (data.type === "error") throw new Error(data.error)
	return data.data
}
