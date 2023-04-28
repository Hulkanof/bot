import { useState } from "react"
import "./App.css"

function App() {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [email, setEmail] = useState("")

	async function handleSubmit() {
		console.log(username, password, email)
	}

	return (
		<>
			<input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
			<input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
			<input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
			<button onClick={handleSubmit}></button>
		</>
	)
}

export default App
