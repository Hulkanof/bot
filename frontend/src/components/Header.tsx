import { Link } from "react-router-dom"
import "../styles/Header.css"

const Header = () => {
	return (
		<div className="header">
			<div className="header-title">Projet</div>
			<div className="header-nav">
				<Link to="/login">Login</Link>
				<Link to="/register">Register</Link>
			</div>
		</div>
	)
}

export default Header
