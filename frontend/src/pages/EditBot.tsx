import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useBot from "../hooks/useBot"
import useBrains from "../hooks/useBrains"
import changeBotBrain from "../functions/bots/brain/changeBotBrain"
import changeBotServices from "../functions/bots/services/changeBotServices"
import { changeName } from "../functions/bots/changeName"
import { queryClient } from "../main"
import "../styles/EditBot.css"

/**
 * Edit bot page
 * @param props 
 */
const EditBot: React.FC<defaultPageProps> = props => {
	const { user, token } = props
	const botId = useParams<{ Id: string }>()
	const { data: bot, isLoading, error } = useBot(token, botId.Id)
	const { data: brains } = useBrains(token)
	const [name, setName] = useState(bot?.name)
	const [brain, setBrain] = useState(bot?.brain.name)
	const [socket, setSocket] = useState(bot?.serviceAccess.socket)
	const [discord, setDiscord] = useState(bot?.serviceAccess.discord)
	const [slack, setSlack] = useState(bot?.serviceAccess.slack)

	useEffect(() => {
		if (!bot) return
		setName(bot.name)
		setBrain(bot.brain.name)
		setSocket(bot.serviceAccess.socket)
		setDiscord(bot.serviceAccess.discord)
		setSlack(bot.serviceAccess.slack)
	}, [bot])

	if (error) return <div>Error: {error.message}</div>
	if (isLoading) return <div>Loading...</div>
	if (!bot) return <div>Bot fetch failed</div>

	/**
	 * Change the name of the bot
	 */
	function handleName() {
		if (name !== undefined && bot) {
			changeName(token, bot.id, name)
				.then(() => {
					queryClient.invalidateQueries(["bots", "all"])
				})
				.catch(err => console.log(err))
		}
	}

	/**
	 * Change the brain of the bot
	 */
	function handleBrain() {
		if (brain !== undefined && bot) {
			changeBotBrain(token, bot.id, brain)
				.then(() => {
					queryClient.invalidateQueries(["bots", "all"])
				})
				.catch(err => console.log(err))
		}
	}

	/**
	 * Change if the bot can talk on the site
	 */
	function handleSocket() {
		if (!bot) return
		const access: ServiceAccess = {
			socket: !!socket,
			discord: bot.serviceAccess.discord,
			slack: bot.serviceAccess.slack,
			mastodon: bot.serviceAccess.mastodon
		}
		changeBotServices(token, bot.id, access)
			.then(() => {
				queryClient.invalidateQueries(["bots", "all"])
			})
			.catch(err => console.log(err))
	}

	/**
	 * Change if the bot can talk on Discord
	 */
	function handleDiscord() {
		if (!bot) return
		const access: ServiceAccess = {
			socket: bot.serviceAccess.socket,
			discord: !!discord,
			slack: bot.serviceAccess.slack,
			mastodon: bot.serviceAccess.mastodon
		}
		changeBotServices(token, bot.id, access)
			.then(() => {
				queryClient.invalidateQueries(["bots", "all"])
			})
			.catch(err => console.log(err))
	}

	/**
	 * Change if the bot can talk on Slack
	 */
	function handleSlack() {
		if (!bot) return
		const access: ServiceAccess = {
			socket: bot.serviceAccess.socket,
			discord: bot.serviceAccess.discord,
			slack: !!slack,
			mastodon: bot.serviceAccess.mastodon
		}
		changeBotServices(token, bot.id, access).catch(err => console.log(err))
	}

	/**
	 * Display the page
	 */
	return (
		<div>
			<h1>You are editing bot {bot.name}</h1>
			<div className="main-edit">

				<div className="bot-name-edit">
					<div className="bot-name-title">Bot name :</div>
					<input type="text" value={name} onChange={e => setName(e.target.value)} className="bot-name-input" />
					<button className="bot-name-button" onClick={() => handleName()}>
						Update
					</button>
				</div>

				<div className="bot-brain">
					<div className="bot-brain-title">Bot brain :</div>
					<select className="bot-brain-select" value={brain} onChange={e => setBrain(e.target.value)}>
						{brains?.map((brain, index) => (
							<option key={index}>{brain.name}</option>
						))}
					</select>
					<button className="bot-brain-button" onClick={() => handleBrain()}>
						Update
					</button>
				</div>

				<div className="bot-services">
					<div className="bot-services-title">Bot services :</div>
					<div className="bot-services-socket">
						<div className="bot-services-socket-title">Socket :</div>
						<input type="checkbox" checked={socket} onChange={e => setSocket(e.target.checked)} className="bot-services-socket-input" />
						<button className="bot-services-socket-button" onClick={() => handleSocket()}>
							Update
						</button>
					</div>
					<div className="bot-services-discord">
						<div className="bot-services-discord-title">Discord :</div>
						<input
							type="checkbox"
							checked={discord}
							onChange={e => setDiscord(e.target.checked)}
							className="bot-services-discord-input"
						/>
						<button className="bot-services-discord-button" onClick={() => handleDiscord()}>
							Update
						</button>
					</div>
					<div className="bot-services-slack">
						<div className="bot-services-slack-title">Slack :</div>
						<input type="checkbox" checked={slack} onChange={e => setSlack(e.target.checked)} className="bot-services-slack-input" />
						<button className="bot-services-slack-button" onClick={() => handleSlack()}>
							Update
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default EditBot
