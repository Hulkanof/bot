import React from "react"
import { useState } from "react"
import useBrains from "../hooks/useBrains"
import changeServiceConfig from "../functions/services/changeServiceConfig"
import createBot from "../functions/bots/createBot"
import createBrain from "../functions/brains/createBrain"
import "../styles/Admin.css"

/**
 * Admin page
 * @param props 
 * @returns 
 */
const Admin: React.FC<defaultPageProps> = props => {
	const { user, token } = props
	const { data, isLoading, error } = useBrains(token)
	const [name, setName] = useState("")
	const [discordToken, setDiscordToken] = useState("")
	const [discordClientId, setDiscordClientId] = useState("")
	const [discordClientSecret, setDiscordClientSecret] = useState("")
	const [slackToken, setSlackToken] = useState("")
	const [slackSigningSecret, setSlackSigningSecret] = useState("")
	const [slackAppToken, setSlackAppToken] = useState("")
	const [newBrainFiles, setNewBrainFiles] = useState<FileList | null>(null)

	if (error) return <div>Error: {error.message}</div>
	if (isLoading) return <div>Loading...</div>
	if (!data) return <div>Users fetch failed</div>
	/**
	 * Edit the discord configuration on the server
	 */
	function handleDiscord() {
		const serviceConfig: ServiceConfig = { type: "discord", token: discordToken, clientId: discordClientId, clientSecret: discordClientSecret }
		changeServiceConfig(token, "discord", serviceConfig).catch(err => console.log(err))
	}

	/**
	 * Edit the slack configuration on the server
	 */
	function handleSlack() {
		const serviceConfig: ServiceConfig = { type: "slack", signingSecret: slackSigningSecret, token: slackToken, appToken: slackAppToken }
		changeServiceConfig(token, "slack", serviceConfig).catch(err => console.log(err))
	}

	/**
	 * Create a new bot on the server
	 * @param name
	 */
	function handleAdd(name: string) {
		createBot(token, name).catch(err => console.log(err))
	}

	/**
	 * Add a new brain on the server
	 * Handle the file upload
	 */
	function handleAddBrain() {
		if (newBrainFiles) {
			const file = newBrainFiles[0]
			if (!file) return

			createBrain(token, {
				file: file,
				name: name
			}).catch(err => console.log(err))
		}
	}

	if (user.admin < 1) return <div>Not authorized</div>
	else {
		/**
		 * Display the admin panel
		 */
		return (
			<div>
				<h1>Welcome to the Admin panel</h1>
				<div className="main-admin">
					<div className="Discord">
						<h2>Here you can manage the Discord configuration</h2>
						<input className="Discord-token" type="text" placeholder="Discord token" onChange={e => setDiscordToken(e.target.value)} />
						<input
							className="Discord-clientId"
							type="text"
							placeholder="Discord client id"
							onChange={e => setDiscordClientId(e.target.value)}
						/>
						<input
							className="Discord-clientSecret"
							type="text"
							placeholder="Discord client secret"
							onChange={e => setDiscordClientSecret(e.target.value)}
						/>
						<button className="Discord-update" onClick={() => handleDiscord()}>
							Update
						</button>
					</div>

					<div className="Slack">
						<h2>Here you can manage the Slack configuration</h2>
						<input className="Slack-token" type="text" placeholder="Slack token" onChange={e => setSlackToken(e.target.value)} />
						<input
							className="signingSecret"
							type="text"
							placeholder="Slack signing secret"
							onChange={e => setSlackSigningSecret(e.target.value)}
						/>
						<input className="appToken" type="text" placeholder="Slack app token" onChange={e => setSlackAppToken(e.target.value)} />
						<button className="Slack-update" onClick={() => handleSlack()}>
							Update
						</button>
					</div>

					<div className="add-bot">
						<h2>If you want you can also a new bot</h2>
						<input className="bot-input" type="text" placeholder="Name" onChange={e => setName(e.target.value)} />
						<button className="bot-add" onClick={() => handleAdd(name)}>
							Add
						</button>
					</div>

					<div className="brain">
						<h2>Here you can add a brain</h2>
						<input className="brain-input" type="file" placeholder="Content" onChange={e => setNewBrainFiles(e.target.files)} />
						<button className="brain-add" onClick={() => handleAddBrain()}>
							Add
						</button>
					</div>
				</div>
			</div>
		)
	}
}

export default Admin
