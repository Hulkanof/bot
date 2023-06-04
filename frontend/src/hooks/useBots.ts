import { UseQueryResult, useQuery } from "@tanstack/react-query"
import getBots from "../functions/bots/getBots"

const useBots = (token: string): UseQueryResult<Bot[], Error> => {
	return useQuery({
		queryKey: ["bots", token],
		queryFn: () => getBots(token),
		cacheTime: 1000 * 60 * 5,
		enabled: !!token && token !== ""
	})
}

export default useBots
