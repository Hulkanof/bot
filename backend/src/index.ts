import express from "express"
import { PrismaClient } from "@prisma/client"
import createUser from "./user/create"
import cookieParser from "cookie-parser"
import loginUser from "./user/login"
import user from "./user"
require("dotenv").config()

// Check for required environment variables
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set")
if (!process.env.TOKEN_SECRET) throw new Error("TOKEN_SECRET not set")
if (!process.env.PORT) console.log("PORT not set, using default 4000")

// Prisma client
export const prisma = new PrismaClient({
	errorFormat: "pretty"
})

// Express app
const app = express()
app.use(express.json())
app.use(cookieParser())

// Routes
app.get("/api/v1/user", user)
app.post("/api/v1/user/create", createUser)
app.post("/api/v1/user/login", loginUser)

// Start server
app.listen(process.env.PORT || 4000, () => {
	console.log(`Server running on port ${process.env.PORT || 4000}`)
})
