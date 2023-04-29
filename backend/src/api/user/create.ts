import { createHash } from "crypto"
import { Request, Response } from "express"
import { prisma } from "../../index"
import { generateAccessToken } from "../../utils/token"
require("dotenv").config()

/**
 * Route handler that creates an account and logs in the user: /api/v1/user/register
 * @param req Request body must contain username, email and password
 * @param res Response body will contain the user and a JWT token
 */
export default async function createUser(req: Request, res: Response) {
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
				email: true
			}
		})

		if (!user) return res.status(400).send({ error: "User not created" })

		const token = generateAccessToken(user)
		res.status(200).send({ user: user, token })
	} catch (error) {
		console.error(error)
		return res.status(500).send({ error: "Internal error!" })
	}
}
