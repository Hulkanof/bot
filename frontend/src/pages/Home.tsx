import React from "react"
import { useNavigate } from "react-router-dom"
import useToken from "../hooks/useToken"

const Home: React.FC<defaultProps> = props => {
	const { user } = props
	const navigate = useNavigate()
	const { token } = useToken()

	if (!token) navigate("/login")

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
