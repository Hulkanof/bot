import React from "react"
import { useState } from "react"
import useBots from "../hooks/useBots"
import "../styles/Bots.css"
import { useNavigate } from "react-router-dom"
import { GoPerson } from "react-icons/go"

/**
 * Bot page
 * @param props
 */
const Bot: React.FC<defaultPageProps> = props => {
	const { user, token } = props
	const { data, isLoading, error } = useBots(token)
	const navigate = useNavigate()
	const [search, setSearch] = useState("")

	if (error) return <div>Error: {error.message}</div>
	if (isLoading) return <div>Loading...</div>
	if (!data) return <div>Bots fetch failed</div>

	const filterData = data.filter(bot => bot.name.toLowerCase().includes(search.toLowerCase()))

	/**
	 * Bring the user to the bot page
	 * @param id
	 */
	function handleTalk(id: string) {
		const bot = filterData.find(bot => bot.id === id)
		navigate("/web-client/" + bot?.socketPort)
	}

	/**
	 * Bring the user to the edit bot page
	 * @param id
	 */
	function handleUpdate(id: string) {
		navigate("/editbot/" + id)
	}

	/**
	 * Display the bot page
	 */
	return (
		<div>
			<h1>Welcome to the bot panel</h1>
			<h2>Here you can have access to any bot you want to talk to !</h2>
			<div className="main-bot">
				<div className="bot-search">
					<input type="text" placeholder="Search..." onChange={e => setSearch(e.target.value)} className="search" />
				</div>
				<div className="bots">
					{filterData.map((bot, index) => (
						<div className="bot-card" key={index}>
							<div className="bot-image">
								<GoPerson size={50} />
							</div>
							{user.admin > 0 ? (
								<>
									<div className="bot-name">{bot.name}</div>
									<div className="bot-brain">Current brain : {bot.brain.name}</div>
									<div className="buttons">
										{bot.serviceAccess.socket ? (
											<button className="bot-talk" onClick={() => handleTalk(bot.id)}>
												Talk
											</button>
										) : (
											<div></div>
										)}
										<button className="bot-update" onClick={() => handleUpdate(bot.id)}>
											Edit
										</button>
									</div>
								</>
							) : (
								<>
									{bot.serviceAccess.socket ? (
										<>
										<div className="bot-name">{bot.name}</div>
										<div className="bot-brain">Current brain : {bot.brain.name}</div>
										<div className="buttons">
											<button className="bot-talk" onClick={() => handleTalk(bot.id)}>
												Talk
											</button>
										</div>
										</>
										) : (
											<div></div>
									)}
								</>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default Bot
