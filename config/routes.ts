import HelloWorldAction from '../src/Action/HelloWorldAction'

const routes = {
    'ws.hello_world': {
        path: '/',
        action: HelloWorldAction,
        method: 'GET'
    }
}

export { routes }
