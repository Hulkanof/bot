import express from "express"

export interface Route {
	path: string
	methods: ("get" | "post" | "put" | "delete" | "patch")[]
	middlewares?: express.RequestHandler[]
	handler: express.RequestHandler
}
