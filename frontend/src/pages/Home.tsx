import React from "react"
import useBots from "../hooks/useBots"

const Home: React.FC<defaultPageProps> = props => {
	const { user, token } = props
	const { data: bots, isLoading, error } = useBots(token)

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
				<h2>Bots</h2>
				<ul>
					{bots?.map((bot, index) => (
						<li key={index}>
							<h3>{bot.name}</h3>
							<p>id: {bot.id}</p>
							<p>brain: {bot.brain.name}</p>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

export default Home
