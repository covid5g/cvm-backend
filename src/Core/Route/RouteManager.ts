import {Request, ResponseObject} from "hapi"
import server from "@hapi/hapi"
import {routes} from "../../../config/routes"
import Route from "./Entity/Route"

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
        for (let key in this.routes) {
            if (!this.routes.hasOwnProperty(key)) {
                continue
            }

            const route = this.routes[key]

            this.registerRoute(route.method, route)
        }
    }

    private registerRoute(method: string, route: Route): void {
        const action = route.action

        this.app.route({
            method,
            path: route.path,
            options: action.options(),
            handler: (request: Request, h: ResponseObject) => {
                const when = new Date().toISOString()
                console.debug(`[${when}] ${request.method.toUpperCase()} ${request.path}`)

                return action.execute(request, h)
            },
        })
    }
}
