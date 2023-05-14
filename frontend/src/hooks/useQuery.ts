import { useEffect, useState } from "react"
import useToken from "./useToken"

interface QueryOptions<T> {
	refetchTimer?: number
	functionParams?: T
}

export default function useQuery<T>(fn: (...args: any[]) => Promise<T>, options?: QueryOptions<Parameters<typeof fn>>) {
	const [data, setData] = useState<T>()
	const [error, setError] = useState<Error>()
	const [isLoading, setIsLoading] = useState(true)
	const [isRefetching, setIsRefetching] = useState(false)
	const [timerReset, setTimerReset] = useState(false)
	const { token } = useToken()

	useEffect(() => {
		if (!token) return
		try {
			if (options && options.functionParams)
				fn(token, options.functionParams).then((data: T) => {
					setData(data)
				})
			else fn(token).then((data: T) => setData(data))
		} catch (error) {
			setError(error as Error)
		}
		setIsLoading(false)
		setTimerReset(prev => !prev)
	}, [token])

	useEffect(() => {
		if (!token) return
		if (!options || !options.refetchTimer || options.refetchTimer <= 0) return
		setIsRefetching(true)
		setTimeout(() => {
			try {
				if (options && options.functionParams)
					fn(token, options.functionParams).then((data: T) => {
						setData(data)
					})
				else fn(token).then((data: T) => setData(data))
			} catch (error) {
				console.log(error)
			}
			setIsRefetching(false)
			setTimerReset(prev => !prev)
		}, options.refetchTimer)
	}, [timerReset])

	return { data, error, isLoading, isRefetching }
}
