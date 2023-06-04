import { prisma } from "../main"
import defaultBrain from "../constants/defaultBrain"

/**
 * Initialize the database with default values
 */
export default async function initDB() {
	// Create default brain if it doesn't exist
	const currentdefaultBrain = await prisma.brains.findUnique({
		where: {
			name: "standard.rive"
		}
	})

	if (!currentdefaultBrain) {
		console.log("Creating default brain standard.rive")
		await prisma.brains.create({
			data: {
				name: defaultBrain.name,
				data: defaultBrain.data
			}
		})
	}
}
