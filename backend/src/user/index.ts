import { Request, Response } from "express"
import { verifyAccessToken } from "../utils/token"
require("dotenv").config()

export default async function user(req: Request, res: Response) {
	if (!req.headers.authorization) return res.status(400).send({ error: "Not Authorized" })

	const token = req.headers.authorization.split(" ")[1]

	const user = verifyAccessToken(token)

	res.status(200).send({ user })
}
