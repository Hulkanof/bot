import { prisma } from ".."
import ChatBot from "../classes/ChatBot"
import { Request, Response } from "express"

/**
 * Route handler to get the brains: /api/v1/brains
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme
 * @param res Response body will contain an array of brains
 */
export async function getBrains(_req: Request, res: Response) {
	try {
		const brains = await prisma.brains.findMany()

		return res.status(200).send(brains)
	} catch (error) {
		return res.status(500).send({ error: "Internal Server Error" })
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

		if (!brain) return res.status(404).send({ error: "Brain not found" })

		return res.status(200).send(brain)
	} catch (error) {
		return res.status(500).send({ error: "Internal Server Error" })
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
		const data = req.body.data
		const brain = await prisma.brains.create({
			data: {
				name,
				data
			}
		})

		return res.status(200).send(brain)
	} catch (error: any) {
		if (error.code === "P2002") return res.status(409).send({ error: "Brain already exists" })
		return res.status(500).send({ error: "Internal Server Error" })
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

		if (!brain) return res.status(404).send({ error: "Brain not found" })

		if (brain.name === "standard.rive") return res.status(403).send({ error: "Cannot delete standard.rive" })

		await prisma.brains.delete({
			where: {
				id
			}
		})

		return res.status(200).send({ message: "Brain deleted" })
	} catch (error) {
		return res.status(500).send({ error: "Internal Server Error" })
	}
}
