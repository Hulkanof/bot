import express from "express"

export interface Route {
	path: string
	method: "get" | "post" | "put" | "delete" | "patch"
	middlewares?: express.RequestHandler[]
	handler: express.RequestHandler
}
