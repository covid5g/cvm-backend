export default class Container {
    private static _svc = {}

    static register(name: string, service, defer?: string): void {
        console.debug('[Entanglement.Core.Database] Registering service', name)

        this._svc[name] = service

        if (defer) {
            this.defer(name, defer)
        }
    }

    static get(name: string): any {
        console.debug('[Entanglement.Core.Database] Injecting service', name)

        return this._svc[name]
    }

    static defer(service: string, method: string) {
        const $this = this.get(service)

        $this[method].call($this)
    }
}
