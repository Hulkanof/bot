import { useEffect, useState } from "react"
import useToken from "./useToken"

interface QueryOptions {
	refetchTimer?: number
	functionParams?: any[]
}

export default function useQuery<T>(fn: Function, options?: QueryOptions) {
	const [data, setData] = useState<T>()
	const [error, setError] = useState<Error>()
	const [timerReset, setTimerReset] = useState(false)
	const { token } = useToken()

	useEffect(() => {
		if (!token) return
		try {
			if (options && options.functionParams)
				fn(token, ...options.functionParams).then((data: T) => {
					setData(data)
				})
			else fn(token).then((data: T) => setData(data))
		} catch (error) {
			setError(error as Error)
		}
	}, [token])

	useEffect(() => {
		if (!options || !options.refetchTimer || options.refetchTimer <= 0) return
		setTimeout(() => {
			try {
				if (options && options.functionParams)
					fn(token, ...options.functionParams).then((data: T) => {
						setData(data)
					})
				else fn(token).then((data: T) => setData(data))
			} catch (error) {
				console.log(error)
			}
			setTimerReset(prev => !prev)
		}, options.refetchTimer)
	}, [timerReset])

	return { data, error }
}
