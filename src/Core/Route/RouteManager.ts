import { Request, ResponseObject, Server } from 'hapi'
import IRoute from './IRoute'

import { readdirSync } from 'fs'
import Container from '../Container/Container'

type RouteInfo = {
    [name: string]: IRoute
}

export default class RouteManager {
    #_app: Server
    #routes: RouteInfo

    constructor(app: Server) {
        this.#_app = app
        this.#routes = {}

        this._forceActionsLoad()
    }

    _forceActionsLoad() {
        const { KERNEL_DIR } = Container.get('config')
        readdirSync(`${ KERNEL_DIR }/Action`)
            .filter(fn => fn.endsWith('Action.ts'))
            .forEach(action => import(action))
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
