import { Request, Response } from "express"
import { generateAccessToken, verifyAccessToken } from "../utils/token"
import { createHash } from "crypto"
import { prisma } from "../main"
import { JsonWebTokenError } from "jsonwebtoken"
require("dotenv").config()

/**
 * Route handler to login a user with the token: /api/v1/user
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme
 * @param res Response body will contain the user information
 */
export async function getUser(req: Request, res: Response) {
	try {
		if (!req.headers.authorization) return res.status(400).send({ error: "Not Authorized" })
		const token = req.headers.authorization.split(" ")[1]
		const user = verifyAccessToken(token)

		res.status(200).send({ user })
	} catch (error) {
		if (error instanceof JsonWebTokenError) return res.status(400).send({ error: "Invalid token" })

		return res.status(500).send({ error: "Internal Server Error" })
	}
}

/**
 * Route handler that logs in a user: /api/v1/user/login
 * @param req Request body must contain username and password
 * @param res Response body will contain the user and a JWT token
 */
export async function loginUser(req: Request, res: Response) {
	try {
		if (!req.body) return res.status(400).send({ error: "No request body" })

		const { username, password } = req.body
		if (!username || !password) return res.status(400).send({ error: "Missing fields" })

		const passhash = createHash("sha256").update(req.body.password).digest("hex")

		const user = await prisma.user.findUnique({
			where: {
				name: username
			}
		})
		if (!user) return res.status(400).send({ error: "User not found" })

		if (user.password !== passhash) return res.status(400).send({ error: "Incorrect password" })

		const { password: _, ...userWithoutPassword } = user
		const token = generateAccessToken(userWithoutPassword)
		res.status(200).send({ user: userWithoutPassword, token })
	} catch (error: any) {
		console.log(error)
		return res.status(500).send({ error: "Internal Server Error" })
	}
}

/**
 * Route handler that creates an account and logs in the user: /api/v1/user/register
 * @param req Request body must contain username, email and password
 * @param res Response body will contain the user and a JWT token
 */
export async function createUser(req: Request, res: Response) {
	try {
		if (!req.body) return res.status(400).send({ error: "No request body" })

		const { username, email, password } = req.body
		if (!username || !email || !password) return res.status(400).send({ error: "Missing fields" })

		const passhash = createHash("sha256").update(req.body.password).digest("hex")
		const user = await prisma.user.create({
			data: {
				email: req.body.email,
				name: req.body.username,
				password: passhash
			},
			select: {
				id: true,
				name: true,
				email: true,
				admin: true
			}
		})

		if (!user) return res.status(400).send({ error: "User not created" })

		const token = generateAccessToken(user)
		res.status(200).send({ user: user, token })
	} catch (error: any) {
		console.error(error)
		if (error.code === "P2002") return res.status(400).send({ error: "User already exists" })
		return res.status(500).send({ error: "Internal error!" })
	}
}
