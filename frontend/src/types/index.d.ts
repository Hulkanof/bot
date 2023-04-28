interface defaultProps {
	[key: string]: any
	user: User
	setUser: React.Dispatch<React.SetStateAction<User>>
}

interface User {
	id: string
	name: string
	email: string
}
