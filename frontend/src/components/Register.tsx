import React, { useState } from "react"

const Register = () => {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [email, setEmail] = useState("")

	async function handleSubmit() {
		const res = await fetch("/api/user/create", {
			method: "POST",
			body: JSON.stringify({ username, password, email }),
			headers: { "Content-Type": "application/json" }
		})
		if (res.ok) {
			const data = await res.json()
			console.log(data)
		}
	}

	return (
		<div>
			<input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
			<input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
			<input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
			<button onClick={handleSubmit}></button>
		</div>
	)
}

export default Register
