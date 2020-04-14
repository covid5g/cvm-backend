import { Server } from '@hapi/hapi'

import config from '../webservice.config'
import RouteManager from './Core/Route/RouteManager'
import Container from './Core/Container/Container'


export default class Application {
    #_app: Server
    #_routeManager: RouteManager

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

        this.#_routeManager = new RouteManager(this.app)

        this._registerServices()
    }

    _registerServices() {
        Container.register('route_manager', this.#_routeManager)
        Container.register('kernel', this.#_app)
    }

    get app(): Server {
        return this.#_app
    }

    get routeManager(): RouteManager {
        return this.#_routeManager
    }

    async boot() {
        try {
            await this.app.start()

            console.log('WebServer started on host %s:%d', this.host, this.port)
        } catch (err) {
            console.error(err)
            process.exit(1)
        }
    }
}
