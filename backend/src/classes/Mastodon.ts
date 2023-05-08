import { MastoConfigProps, login } from "masto"

export default class Mastodon {
	private masto!: Awaited<ReturnType<typeof login>>
	constructor(config: MastoConfigProps) {
		login(config)
			.then(client => this.initBot(client))
			.catch(err => console.log(err))
	}

	private async initBot(client: Awaited<ReturnType<typeof login>>) {
		this.masto = client
		this.masto.v1.statuses
			.create({
				status: "Hello, world!",
				visibility: "public"
			})
			.then(res => console.log(res))
			.catch(err => console.log(err))
	}
}
