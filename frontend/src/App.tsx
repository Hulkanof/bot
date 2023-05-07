import "./styles/App.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Header from "./components/Header"
import Home from "./pages/Home"
import { useEffect, useState } from "react"
import useToken from "./hooks/useToken"
import WebSocketInterface from "./pages/WebSocketInterface"
import Page404 from "./pages/404"

function App() {
	const [user, setUser] = useState<User>({
		id: "",
		name: "",
		email: "",
		admin: 0
	})
	const { token, clearToken } = useToken()

	useEffect(() => {
		if (!token) return setUser({ id: "", name: "", email: "", admin: 0 })
		if (user.id !== "") return
		async function fetchUser() {
			const res = await fetch("/api/v1/user", {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				}
			})
			const data = await res.json()
			if (data.type === "success") {
				return setUser({
					id: data.data.id,
					name: data.data.name,
					email: data.data.email,
					admin: data.data.admin
				})
			}
			setUser({ id: "", name: "", email: "", admin: 0 })
			clearToken()
			window.location.href = "/login"
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
				<Route path="*" element={<Page404 />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
