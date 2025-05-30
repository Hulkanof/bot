import "./styles/App.css"
import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Header from "./components/Header"
import Home from "./pages/Home"
import SuperAdmin from "./pages/SuperAdmin"
import { useEffect, useState } from "react"
import useToken from "./hooks/useToken"
import WebSocketInterface from "./pages/WebSocketInterface"
import Page404 from "./pages/404"
import { useNavigate, useLocation } from "react-router-dom"
import { SideBarMenuItem } from "./types/SideBarMenu"
import { FcManager, FcSupport, FcVoicePresentation } from "react-icons/fc"
import SideBarMenu from "./components/SideBarMenu"
import Bot from "./pages/Bots"
import Admin from "./pages/Admin"
import EditBot from "./pages/EditBot"

function App() {
	const [user, setUser] = useState<User>({
		id: "",
		name: "",
		email: "",
		admin: 0
	})
	const { token, isLoading, clearToken } = useToken()
	const navigate = useNavigate()
	const location = useLocation()

	useEffect(() => {
		if (isLoading) return
		if (token === "") {
			setUser({ id: "", name: "", email: "", admin: 0 })
			if (location.pathname !== "/register") navigate("/login")
			return
		}
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
				setUser({
					id: data.data.id,
					name: data.data.name,
					email: data.data.email,
					admin: data.data.admin
				})
				if (location.pathname === "/login" || location.pathname === "/register") navigate("/")
				return
			}
			setUser({ id: "", name: "", email: "", admin: 0 })
			clearToken()
		}
		fetchUser()
	}, [token, isLoading])

	const props = { user, setUser, token }

	const items: SideBarMenuItem[] = [
		{
			id: "1",
			label: "SuperAdmin panel",
			icon: FcSupport,
			url: "/superadmin",
			privilegeNeeded: 2
		},
		{
			id: "2",
			label: "Admin panel",
			icon: FcManager,
			url: "/admin",
			privilegeNeeded: 1
		},
		{
			id: "3",
			label: "Bot panel",
			icon: FcVoicePresentation,
			url: "/bot",
			privilegeNeeded: 0
		}
	]

	return (
		<>
			<Header {...props} />
			<div className="App">
				<SideBarMenu items={items} user={user} />
				<Routes>
					<Route path="/" element={<Home {...props} />} />
					<Route path="/login" element={<Login {...props} />} />
					<Route path="/register" element={<Register {...props} />} />
					<Route path="/web-client/:socketPort" element={<WebSocketInterface {...props} />} />
					<Route path="*" element={<Page404 />} />
					<Route path="/superadmin" element={<SuperAdmin {...props} />} />
					<Route path="/bot" element={<Bot {...props} />} />
					<Route path="/admin" element={<Admin {...props} />} />
					<Route path="/editbot/:Id" element={<EditBot {...props} />} />
				</Routes>
			</div>
		</>
	)
}

export default App
