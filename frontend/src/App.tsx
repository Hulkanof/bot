import { useState } from "react"
import "./App.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./components/Login"
import Register from "./components/Register"

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/Login" element={<Login />} />
				<Route path="/Register" element={<Register />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
