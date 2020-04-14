import { Server } from 'hapi'

import config from '../webservice.config'

export default class Application {
    #_app: Server

    get host(): string {
        return config.HTTP_HOST
    }

    get port(): string | number {
        return config.HTTP_PORT
    }

    constructor() {
        this.#_app = new Server({
            host: config.HTTP_HOST,
            port: config.HTTP_PORT,
            routes: {
                cors: {
                    origin: [ '*' ]
                }
            }
        })
    }

    get app(): Server {
        return this.#_app
    }

    async boot() {
        try {
            await this.app.start()

            console.log("WebServer started on host %s:%d", this.host, this.port)
        } catch (err) {
            console.error(err)
            process.exit(1)
        }
    }
}
