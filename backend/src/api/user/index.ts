import { Request, Response } from "express"
import { verifyAccessToken } from "../../utils/token"
require("dotenv").config()

/**
 * Route handler to login a user with the token: /api/v1/user
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme
 * @param res Response body will contain the user information
 */
export default async function user(req: Request, res: Response) {
	try {
		if (!req.headers.authorization) return res.status(400).send({ error: "Not Authorized" })

		const token = req.headers.authorization.split(" ")[1]

		const user = verifyAccessToken(token)

		res.status(200).send({ user })
	} catch (error) {
		console.error(error)
		return res.status(500).send({ error: "Internal error!" })
	}
}
