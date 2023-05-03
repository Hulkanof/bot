import type { Request, Response } from 'express'
import { environment } from '../main'

export async function getServices(req: Request, res: Response) {
    const availableServices = {
        discord: environment.discordConfigOK,
        mastodon: environment.mastodonConfigOK,
        slack: environment.slackConfigOK
    }

    res.status(200).send(availableServices)
}
