import React from "react"
import useToken from "../hooks/useToken"
import useQuery from "../hooks/useQuery"
import getBrains from "../functions/brains/getBrains"

const Home: React.FC<defaultPageProps> = props => {
	const { user } = props
	const { token, isLoading: tokenLoading } = useToken()
	const { data: brains, isLoading, error } = useQuery(getBrains, { refetchTimer: 5000, functionParams: [token] })

	if (tokenLoading) return <div>Loading...</div>
	if (isLoading) return <div>Loading...</div>
	if (error) return <div>Error: {error.message}</div>

	return (
		<div>
			<h1>Welcome!</h1>
			<div>
				<h2>User</h2>
				<p>ID: {user.id}</p>
				<p>Name: {user.name}</p>
				<p>Email: {user.email}</p>
				<p>Admin: {user.admin}</p>
			</div>
			<div>
				<h2>Brains</h2>
				{brains?.map((brain, index) => (
					<div key={index}>
						<h3>{brain.name}</h3>
						<p>{brain.data.slice(0, 30000) + " ..."}</p>
					</div>
				))}
			</div>
		</div>
	)
}

export default Home
