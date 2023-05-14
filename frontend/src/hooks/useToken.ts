import { useEffect, useState } from "react"

const useToken = () => {
	const [token, setToken] = useState<string | null | undefined>(undefined)

	function saveToken(userToken: string) {
		sessionStorage.setItem("token", userToken)
		setToken(userToken)
	}

	function clearToken() {
		sessionStorage.removeItem("token")
		setToken(null)
	}

	useEffect(() => {
		const localToken = sessionStorage.getItem("token")
		if (localToken) {
			setToken(localToken)
		}
	}, [])

	return {
		clearToken,
		setToken: saveToken,
		token
	}
}

export default useToken
