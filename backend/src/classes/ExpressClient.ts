import express from "express"
import type { Express } from "express"
import cookieParser from "cookie-parser"
import type { Route } from "../types/express"
import { Server } from "http"

export default class ExpressClient {
	private app: Express
	private server: Server
	constructor(routes: Route[], port: number) {
		this.app = express()
		this.app.use(express.json())
		this.app.use(cookieParser())

		routes.forEach(route => {
			if (route.middlewares) this.app[route.method](route.path, route.middlewares, route.handler)
			else this.app[route.method](route.path, route.handler)
		})

		this.server = this.app.listen(port, () => {
			console.log(`API server running on port ${port}`)
		})
	}

	public close() {
		this.server.close()
	}
}
