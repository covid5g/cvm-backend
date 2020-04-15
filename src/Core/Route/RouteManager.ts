import { Request, ResponseToolkit } from 'hapi'
import server from '@hapi/hapi'
import { routes } from '../../../config/routes'
import Route from './Entity/Route'

export default class RouteManager {
    app: server
    routes: object

    constructor(app: server) {
        this.app = app

        this.loadRoutes()
        this.initRoutes()
    }

    private loadRoutes(): void {
        this.routes = routes
    }

    private initRoutes(): void {
        Object.keys(this.routes).forEach(route => {
            console.log('[Entanglement.Core.Route.RouteManager] Registering route', route, this.routes[route])

            this.registerRoute(
                this.routes[route].method,
                this.routes[route]
            )
        })
    }

    private registerRoute(method: string, route: Route): void {
        const action = route.action

        this.app.route({
            method,
            path: route.path,
            options: action.options(),
            handler: async (request: Request, h: ResponseToolkit) => {
                const when = new Date().toISOString()
                console.log(`[${ when }] ${ request.method.toUpperCase() } ${ request.path }`)

                try {
                    return await action.execute(request, h)
                } catch (e) {
                    console.log(`[${ when }] ${ request.method.toUpperCase() } ${ request.path }`, e)

                    return {
                        err: true,
                        res: e.message
                    }
                }
            }
        })
    }
}
