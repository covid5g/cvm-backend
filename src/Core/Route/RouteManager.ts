import { Request, ResponseToolkit } from 'hapi'
import { routes } from '../../../config/routes'
import Route from './Entity/Route'
import Container from '../Container/Container'

export default class RouteManager {
    constructor() {

    }

    private initRoutes(): void {
        Object.keys(routes).forEach(route => {
            console.log('[Entanglement.Core.Route.RouteManager] Registering route', route, routes[route])

            this.registerRoute(
                routes[route].method,
                routes[route]
            )
        })
    }

    private registerRoute(method: string, route: Route): void {
        const action = route.action

        Container
            .get('kernel')
            .route({
                method,
                path: route.path,
                options: action.options(),
                handler: async (request: Request, h: ResponseToolkit) => {
                    const when = new Date().toISOString()
                    console.log(`[${ when }] ${ request.method.toUpperCase() } ${ request.path }`)

                    try {
                        return action.execute(request, h)
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
