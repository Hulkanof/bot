import React from "react"
import useWebSocket from "react-use-websocket"
import { useNavigate } from "react-router-dom"
import useToken from "../hooks/useToken"
import "../styles/messageBox.css"

interface props extends defaultProps {
	socketport: number
}

const WebSocketInterface: React.FC<props> = ({ socketport, user }) => {
	const [message, setMessage] = React.useState("")
	const [recievedMessages, setRecievedMessages] = React.useState<string[]>([])
	const navigate = useNavigate()
	const { token } = useToken()
	if (!token) navigate("/login")
	const bottomRef = React.useRef<HTMLDivElement>(null)

	const { sendMessage, readyState } = useWebSocket(`ws://localhost:${socketport}?name=${user.name}`, {
		onOpen: () => console.log("Connected"),
		shouldReconnect: () => true,
		onMessage: e => {
			if (!user.name) return
			setRecievedMessages(prevState => [...prevState, `Bot: ${e.data}`])
			bottomRef.current?.scrollIntoView({ behavior: "smooth" })
		}
	})
	if (readyState !== 1) return <div>Not connected</div>

	function handleSend() {
		sendMessage(message)
		setRecievedMessages(prevState => [...prevState, `${user.name}: ${message}`])
		setMessage("")
	}

	function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter") {
			handleSend()
		}
	}

	return (
		<div className="message-grid">
			<div className="message-box-container">
				<div className="message-box">
					{recievedMessages.map(rMessage => {
						return <div>{rMessage}</div>
					})}
					<div ref={bottomRef} />
				</div>
				<div className="message-input-section">
					<input
						className="message-input"
						type="text"
						value={message}
						onChange={e => setMessage(e.target.value)}
						onKeyDown={handleKeyDown}
					/>
					<input className="message-button" type="button" value="Send" onClick={() => handleSend()} />
				</div>
			</div>
		</div>
	)
}

export default WebSocketInterface
