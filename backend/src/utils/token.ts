import jwt from "jsonwebtoken"

/**
 * Creates a signed JWT token
 * @param user The content of the token
 * @returns A signed JWT token
 */
export function generateAccessToken(user: User) {
	if (!process.env.TOKEN_SECRET) throw new Error("No token secret")
	return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: "32d" })
}

/**
 * Verifies a signed JWT token
 * @param token A signed JWT token
 * @returns The content of the token if it is valid and not expired
 */
export function verifyAccessToken(token: string): User {
	if (!process.env.TOKEN_SECRET) throw new Error("No token secret")
	return jwt.verify(token, process.env.TOKEN_SECRET) as User
}
