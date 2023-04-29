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
	private server?: Server

	/**
	 * Port to run the server on
	 */
	private port: number

	/**
	 * Array of used ports
	 */
	public static usedPorts: number[] = []

	/**
	 * Creates an instance of ExpressClient.
	 * @param routes An array of routes to add to the server
	 * @param port Port to run the server on
	 * @param start Whether to start the server or not (default: false)
	 */
	constructor(routes: Route[], port: number, start: boolean = false) {
		this.port = port
		this.app = express()
		this.app.use(express.json())
		this.app.use(cookieParser())

		// Add routes from routes array
		routes.forEach(route => {
			if (route.middlewares) this.app[route.method](route.path, route.middlewares, route.handler)
			else this.app[route.method](route.path, route.handler)
		})

		ExpressClient.usedPorts.push(port)

		if (start) this.start()
	}

	/**
	 * Starts the server
	 */
	public start() {
		if (this.server) throw new Error("Server already started")
		this.server = this.app.listen(this.port, () => {
			console.log(`API server running on port ${this.port}`)
		})
	}

	/**
	 * Starts the server for the provided http server
	 * @param server http server to start the server for
	 */
	public startWithServer(server: Server) {
		if (this.server) throw new Error("Server already started")
		this.server = server
		this.server.listen(this.port, () => {
			console.log(`Server running on port ${this.port}`)
		})
	}

	/**
	 * Returns the express app
	 */
	public getApp(): Express {
		return this.app
	}

	/**
	 * Returns the server
	 */
	public getServer(): Server | undefined {
		return this.server
	}

	/**
	 * Returns the port the server is running on
	 */
	public getPort(): number {
		return this.port
	}

	/**
	 * Closes the server
	 */
	public close() {
		if (this.server) this.server.close()
	}
}
