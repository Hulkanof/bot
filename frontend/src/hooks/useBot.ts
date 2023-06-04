import { UseQueryResult, useQuery } from "@tanstack/react-query"
import getBot from "../functions/bots/getBot"

const useBot = (token: string, id?: string): UseQueryResult<Bot, Error> => {
	const newId = id || ""
	return useQuery({
		queryKey: ["bot", token, id],
		queryFn: () => getBot(token, newId),
		cacheTime: 1000 * 60 * 5,
		enabled: !!token && token !== "" && !!id && id !== ""
	})
}

export default useBot
