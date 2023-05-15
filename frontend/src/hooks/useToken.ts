import { useEffect, useState } from "react"

const useToken = () => {
	const [token, setToken] = useState<string | null | undefined>(undefined)
	const [isLoading, setIsLoading] = useState(true)
	function saveToken(userToken: string) {
		localStorage.setItem("token", userToken)
		setToken(userToken)
	}

	function clearToken() {
		localStorage.removeItem("token")
		setToken(null)
	}

	useEffect(() => {
		const localToken = localStorage.getItem("token")
		if (typeof localToken !== "undefined") setToken(localToken)
		setIsLoading(false)
	}, [])

	return {
		clearToken,
		isLoading,
		setToken: saveToken,
		token
	}
}

export default useToken
