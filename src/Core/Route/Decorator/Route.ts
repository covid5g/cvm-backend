import Container from '../../Container/Container'

export const Route = (name: string, routeInfo): ClassDecorator => {
    return (target: any) => {
        console.debug(name, routeInfo, target)
        Container.get('route_manager').registerRoute(name, target, routeInfo)
    }
}
