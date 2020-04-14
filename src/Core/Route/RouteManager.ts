import { Request, ResponseObject, Server } from 'hapi'
import IRoute from './IRoute'

type RouteInfo = {
    [name: string]: IRoute
}

export default class RouteManager {
    #_app: Server
    #routes: RouteInfo

    constructor(app: Server) {
        this.#_app = app
        this.#routes = {}
    }

    registerRoute(name: string, action: any, routeInfo: IRoute): void {
        const _act = new action()

        this.#_app.route({
            method: routeInfo.method,
            path: routeInfo.path,
            options: _act.options(),
            handler: (request: Request, h: ResponseObject) => {
                const when = new Date().toISOString()
                console.log(`[${ when }] ${ request.method.toUpperCase() } ${ request.path }`)

                return _act.execute(request, h)
            }
        })
    }
}
