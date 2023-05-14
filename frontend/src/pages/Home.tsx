import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useToken from "../hooks/useToken"
import useQuery from "../hooks/useQuery"
import getBrains from "../functions/brains/getBrains"

const Home: React.FC<defaultPageProps> = props => {
	const { user } = props
	const navigate = useNavigate()
	const { token } = useToken()
	const { data: brains, isLoading, error } = useQuery(getBrains, { refetchTimer: 5000, functionParams: [token] })

	useEffect(() => {
		if (token === null) navigate("/login")
	}, [])

	if (isLoading) return <div>Loading...</div>
	if (error) return <div>Error: {error.message}</div>
	return (
		<div>
			<h1>Welcome!</h1>
			<div>
				<div>{user.name}</div>
				<div>{user.email}</div>
			</div>
		</div>
	)
}

export default Home
