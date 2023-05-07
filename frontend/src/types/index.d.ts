interface defaultProps {
	[key: string]: any
	user: User
	setUser: React.Dispatch<React.SetStateAction<User>>
}

type BasicAPIResponse<T> = BasicAPIResponseError | BasicAPIResponseNoError<T>

type BasicAPIResponseError = {
	type: "error"
	error: string
}

type BasicAPIResponseNoError<T> = {
	type: "success"
	message: string
	data: T
}

interface User {
	id: string
	name: string
	email: string
	admin: number
}

interface Bot {
	id: string
	name: string
	activeChatCount: number
	brain: Omit<Brain, "data">
	serviceAccess: ServiceAccess
	socketPort: number
}

interface Brain {
	id: string
	name: string
	data: string
}

interface ServiceAccess {
	discord: boolean
	mastodon: boolean
	slack: boolean
}
