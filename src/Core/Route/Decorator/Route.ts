import IRoute from '../IRoute'

import Container from '../../Container/Container'

export const Route = (name: string, routeInfo: IRoute): ClassDecorator => {
    return (target: any) => {
        Container.get('route_manager').registerRoute(name, target, routeInfo)
    }
}
