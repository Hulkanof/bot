import "./styles/App.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./components/Login"
import Register from "./components/Register"
import Header from "./components/Header"

function App() {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/Login" element={<Login />} />
				<Route path="/Register" element={<Register />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
