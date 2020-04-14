import Action from '../Core/Route/Action'
import { Route } from '../Core/Route/Decorator/Route'

@Route('hello_world', {
    method: 'GET',
    path: '/'
})
class HelloWorldAction extends Action {
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
