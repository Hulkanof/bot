import "./styles/App.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Header from "./components/Header"
import Home from "./pages/Home"
import { useEffect, useState } from "react"
import useToken from "./hooks/useToken"
import WebSocketInterface from "./pages/WebSocketInterface"

function App() {
	const [user, setUser] = useState<User>({
		id: "",
		name: "",
		email: ""
	})

	const { token } = useToken()

	useEffect(() => {
		if (!token) return setUser({ id: "", name: "", email: "" })
		if (user.id !== "") return
		async function fetchUser() {
			const res = await fetch("/api/v1/user", {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				}
			})
			if (res.ok) {
				const data = await res.json()
				setUser({
					id: data.user.id,
					name: data.user.name,
					email: data.user.email
				})
			}
		}
		fetchUser()
	}, [token])

	const props = { user, setUser }
	return (
		<BrowserRouter>
			<Header {...props} />
			<Routes>
				<Route path="/" element={<Home {...props} />} />
				<Route path="/login" element={<Login {...props} />} />
				<Route path="/register" element={<Register {...props} />} />
				<Route path="/web-client" element={<WebSocketInterface {...props} socketport={4001} />} />
				<Route path="*" element={<h1>404</h1>} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
