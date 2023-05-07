/**
 * Returns a list of bots
 * @param token The user token
 * @returns A list of bots
 * @throws Error if the request fails
 */
export default async function getBots(token: string): Promise<Bot[]> {
	const res = await fetch("/api/v1/bots", {
		method: "GET",
		headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
	})

	const data: BasicAPIResponse<Bot[]> = await res.json()
	if (data.type === "error") throw new Error(data.error)
	return data.data
}
