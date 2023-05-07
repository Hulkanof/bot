/**
 * This function is used to change the configuration of a service
 * @param token The user token
 * @param serviceName The name of the service
 * @param config The new configuration
 * @returns A message
 * @throws Error if the request fails
 */
export default async function changeServiceConfig(token: string, serviceName: string, config: ServiceConfig): Promise<String> {
	const response = await fetch(`/api/v1/services/${serviceName}`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(config)
	})

	const data: BasicAPIResponse<null> = await response.json()
	if (data.type === "error") throw new Error(data.error)
	return data.message
}
