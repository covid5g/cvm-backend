import { Server } from '@hapi/hapi'

import config from '../webservice.config'
import RouteManager from './Core/Route/RouteManager'
import Container from './Core/Container/Container'
import * as DotEnv from 'dotenv'
import Database from './Core/Database/Database'
import UserService from './Service/User/UserService'

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
        DotEnv.config()

        Container.register('config', {
            KERNEL_DIR: __dirname
        })
        Container.register('database', new Database())

        this.#_app = new Server({
            host: config.HTTP_HOST,
            port: config.HTTP_PORT,
            routes: {
                cors: {
                    origin: [ '*' ]
                }
            }
        })

        Container.register('kernel', this.#_app)
        Container.register('route_manager', new RouteManager(), 'initRoutes')
    }

    _initAuth() {
        this.#_app.auth.strategy('session', 'cookie', {
            cookie: {
                name: 'cvmsess',
                password: '!wsYhFA*C2U6nz=Bu^%A@^F#SF3&kSR6',
                isSecure: false
            },
            redirectTo: '/user/login',
            validateFunc: async (request, session) => {
                return new UserService().validate(request, session)
            }
        })

        this.#_app.auth.default('session')
    }

    get app(): Server {
        return this.#_app
    }

    async boot() {
        try {
            await this.#_app.register(require('@hapi/cookie'))

            this._initAuth()

            await this.app.start()

            console.log('WebServer started on host %s:%d', this.host, this.port)
        } catch (err) {
            console.error(err)
            process.exit(1)
        }
    }
}
