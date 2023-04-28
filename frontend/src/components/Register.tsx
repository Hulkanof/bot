import { useState } from "react"
import "../styles/Register.css"

const Register = () => {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [email, setEmail] = useState("")

	async function handleSubmit() {
		const res = await fetch("/api/user/create", {
			method: "POST",
			body: JSON.stringify({
				username,
				password,
				email
			}),
			headers: { "Content-Type": "application/json" }
		})
		if (res.ok) {
			const data = await res.json()
			console.log(data)
		}
	}

	return (
		<div className="grid h-full">
			<div className="register">
				<input className="register-input" type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
				<input className="register-input" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
				<input className="register-input" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
				<button className="register-button" onClick={handleSubmit}>
					Login
				</button>
			</div>
		</div>
	)
}

export default Register
