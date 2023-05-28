import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useToken from "../hooks/useToken"
import { SideBarMenuItem } from "../types/SideBarMenu"
import { FcAdvertising } from "react-icons/fc"
import { SideBarMenu } from "../components/SideBarMenu"

const Home: React.FC<defaultPageProps> = props => {
	const { user } = props
	const navigate = useNavigate()
	const { token } = useToken()

	useEffect(() => {
		if (!token) navigate("/login")
	}, [])
	
	const items: SideBarMenuItem[] = [
		{
			id: "1",
			label: "Home",
			icon : FcAdvertising,
			url : "/"
		},
	];
		
	if (!token) navigate("/login")

	return (
		
		<div>
			<div>
			<SideBarMenu items={items}/>
			</div>
			<h1>Welcome!</h1>
			<div>
				<div>{user.name}</div>
				<div>{user.email}</div>
			</div>
		</div>
	)
}

export default Home
