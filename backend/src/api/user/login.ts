import { createHash } from "crypto"
import { Request, Response } from "express"
import { prisma } from "../../index"
import { generateAccessToken } from "../../utils/token"
require("dotenv").config()

export default async function loginUser(req: Request, res: Response) {
	try {
		if (!req.body) return res.status(400).send({ error: "No request body" })

		const { username, password } = req.body
		if (!username || !password) return res.status(400).send({ error: "Missing fields" })

		const passhash = createHash("sha256").update(req.body.password).digest("hex")

		const users = await prisma.user.findMany({
			where: {
				name: username
			}
		})

		if (!users) return res.status(400).send({ error: "User not found" })

		const user = users[0]

		if (user.password !== passhash) return res.status(400).send({ error: "Incorrect password" })

		const { password: _, ...userWithoutPassword } = user
		const token = generateAccessToken(userWithoutPassword)
		res.status(200).send({ user: userWithoutPassword, token })
	} catch (error) {
		console.error(error)
		return res.status(500).send({ error: "Internal error!" })
	}
}
