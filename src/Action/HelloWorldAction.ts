import Action from '../Core/Route/Action'

export default new class HelloWorldAction extends Action {
    execute(req, res): object {
        return {
            error: null,
            message: "Hello, World!",
        }
    }

    options(): object {
        return {
            auth: false
        }
    }
}
