import express from "express"

const app = express()

app.get("/", (req, res) => {
	res.send("Hello world")
})

app.post("/api/user/create", (req, res) => {
	res.send("User created")
})

app.listen(4000, () => {
	console.log("Server running on port 4000")
})
