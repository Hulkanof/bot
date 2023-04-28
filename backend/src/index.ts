import express from "express"
import { PrismaClient } from '@prisma/client'
import { createHash } from "crypto"

const app = express()
app.use(express.json())
export const prisma = new PrismaClient({
	errorFormat: 'pretty'
})


app.get("/", (req, res) => {
	res.send("Hello world")
})

app.post("/api/user/create", async (req, res) => {
	const {username, email, password} = req.body
	if (!req.body) {
		return res.status(400).send({
			error : "No request body"
		}) 
	}
	if (!username || !email || !password) {
		return res.status(400).send({
			error : "Missing fields"
		})
	}
	console.log(req.body)
	const passhash = createHash("sha256").update(req.body.password).digest("hex")
	const result = await prisma.user.create({
		data: { email: req.body.email, name: req.body.username, password: passhash }
	})
	console.log("User created")
	res.send(result) 
})

app.listen(4000, () => {
	console.log("Server running on port 4000")
})
