import jwt from "jsonwebtoken"

export function generateAccessToken(user: User) {
	if (!process.env.TOKEN_SECRET) throw new Error("No token secret")
	return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: "32d" })
}

export function verifyAccessToken(token: string): User {
	if (!process.env.TOKEN_SECRET) throw new Error("No token secret")
	return jwt.verify(token, process.env.TOKEN_SECRET) as User
}
