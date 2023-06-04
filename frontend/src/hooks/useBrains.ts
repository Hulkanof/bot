import { UseQueryResult, useQuery } from "@tanstack/react-query"
import getBrains from "../functions/brains/getBrains"

/**
 * Hook to get all brains
 * @param token The token of the user
 * @returns A list of all brains
 */
const useBrains = (token: string): UseQueryResult<Brain[], Error> => {
	return useQuery({
		queryKey: ["brains", token],
		queryFn: () => getBrains(token),
		cacheTime: 1000 * 60 * 5,
		enabled: !!token && token !== ""
	})
}

export default useBrains
