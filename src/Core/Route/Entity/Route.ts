import Action from "./../Action"

export default interface Route {
    path: string
    action: Action,
    methods: Array<string> | string
}
