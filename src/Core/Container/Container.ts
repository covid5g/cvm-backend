export default class Container {
    private static _svc = {}

    static register(name: string, service): void {
        this._svc[name] = service
    }

    static get(name: string): any {
        return this._svc[name]
    }
}
