import { Route } from '../Core/Route/Decorator/Route'
import IAction from '../Core/Route/IAction'

@Route('hello_world', {
    method: 'GET',
    path: '/'
})
class HelloWorldAction implements IAction {
    execute(req, res): object {
        return {
            error: null,
            message: 'Hello, World!'
        }
    }

    options(): object {
        return {}
    }
}

export default HelloWorldAction
