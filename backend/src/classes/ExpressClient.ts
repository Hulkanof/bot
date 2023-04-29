import express from "express"
import cookieParser from "cookie-parser"
import { Server } from "http"
import type { Express } from "express"
import type { Route } from "../types/express"

/**
 * Express Client
 */
export default class ExpressClient {
	/**
	 * Express app
	 */
	private app: Express

	/**
	 * Express Server
	 */
	private server: Server

	/**
	 * Creates an instance of ExpressClient.
	 * @param routes An array of routes to add to the server
	 * @param port Port to run the server on
	 */
	constructor(routes: Route[], port: number) {
		this.app = express()
		this.app.use(express.json())
		this.app.use(cookieParser())

		// Add routes from routes array
		routes.forEach(route => {
			if (route.middlewares) this.app[route.method](route.path, route.middlewares, route.handler)
			else this.app[route.method](route.path, route.handler)
		})

		this.server = this.app.listen(port, () => {
			console.log(`API server running on port ${port}`)
		})
	}

	/**
	 * Closes the server
	 */
	public close() {
		this.server.close()
	}
}
