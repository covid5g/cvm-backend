export default class Container {
    private static _svc = {}

    static register(name: string, service): void {
        console.debug('[Entanglement.Core.Database] Registering service', name)

        this._svc[name] = service
    }

    static get(name: string): any {
        console.debug('[Entanglement.Core.Database] Injecting service', name)

        return this._svc[name]
    }
}
