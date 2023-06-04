import { prisma } from "../main"
import { Request, Response } from "express"

/**
 * Route handler to get the brains: /api/v1/brains
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme
 * @param res Response body will contain an array of brains
 */
export async function getBrains(_req: Request, res: Response) {
	try {
		const brains = await prisma.brains.findMany()

		return res.status(200).send({
			type: "success",
			data: brains
		})
	} catch (error) {
		return res.status(500).send({ type: "error", error: "Internal Server Error" })
	}
}

/**
 * Route handler to get a sprecific brain: /api/v1/brains/:id
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme
 * @param res Response body will contain the bots brain
 */
export async function getBrain(req: Request, res: Response) {
	try {
		const id = req.params.id
		const brain = await prisma.brains.findUnique({
			where: {
				id
			}
		})

		if (!brain) return res.status(404).send({ type: "error", error: "Brain not found" })

		return res.status(200).send({
			type: "success",
			data: brain
		})
	} catch (error) {
		return res.status(500).send({ type: "error", error: "Internal Server Error" })
	}
}

/**
 * Route handler to create a new brain: /api/v1/brains/create/:name
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme, and a body with the data of the brain
 * @param res Response body will contain the newly created brain
 */
export async function createBrain(req: Request, res: Response) {
	try {
		const name = req.params.name
		const file = req.file

		if (!file || !name) return res.status(400).send({ type: "error", error: "Missing Body" })

		const content = file.buffer.toString("utf-8")

		const brain = await prisma.brains.create({
			data: {
				name,
				data: content
			}
		})

		return res.status(200).send({
			type: "success",
			data: brain
		})
	} catch (error: any) {
		if (error.code === "P2002") return res.status(409).send({ type: "error", error: "Brain already exists" })
		return res.status(500).send({ type: "error", error: "Internal Server Error" })
	}
}


/**
 * Route handler to delete a brain: /api/v1/brains/delete/:id
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme
 * @param res Response body will contain the deleted brain
 */
export async function deleteBrain(req: Request, res: Response) {
	try {
		const id = req.params.id

		const brain = await prisma.brains.findUnique({
			where: {
				id
			}
		})

		if (!brain) return res.status(404).send({ type: "error", error: "Brain not found" })

		if (brain.name === "standard.rive") return res.status(403).send({ type: "error", error: "Cannot delete standard.rive" })

		await prisma.brains.delete({
			where: {
				id
			}
		})

		return res.status(200).send({ type: "success", message: "Brain deleted" })
	} catch (error) {
		return res.status(500).send({ type: "error", error: "Internal Server Error" })
	}
}

/**
 * Route handler to modify a brain: /api/v1/brains/modify/:id
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme, and a body with the data of the brain
 * @param res Response body will contain the modified brain
 */
export async function modifyBrain(req: Request, res: Response) {
	try {
		const id = req.params.id
		if (!req.body) return res.status(400).send({ type: "error", error: "Missing Body" })

		const { name, data } = req.body
		if (!name || !data) return res.status(400).send({ type: "error", error: "Missing Body" })
		if (name === "standard.rive") return res.status(403).send({ type: "error", error: "Cannot modify standard.rive" })

		const brain = await prisma.brains.findUnique({
			where: {
				id
			}
		})
		if (!brain) return res.status(404).send({ type: "error", error: "Brain not found" })

		const modifiedBrain = await prisma.brains.update({
			where: {
				id
			},
			data: {
				name,
				data
			}
		})

		return res.status(200).send({
			type: "success",
			data: modifiedBrain
		})
	} catch (error) {
		return res.status(500).send({ type: "error", error: "Internal Server Error" })
	}
}
