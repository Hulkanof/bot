import { UseQueryResult, useQuery } from "@tanstack/react-query"
import getBots from "../functions/bots/getBots"

/**
 * Hook to get all bots
 * @param token The token of the user
 * @returns The bots
 */
const useBots = (token: string): UseQueryResult<Bot[], Error> => {
	return useQuery({
		queryKey: ["bots", "all"],
		queryFn: () => getBots(token),
		cacheTime: 1000 * 60 * 5,
		enabled: !!token && token !== ""
	})
}

export default useBots
