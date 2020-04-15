import HelloWorldAction from '../src/Action/HelloWorldAction'
import DbTestAction from '../src/Action/DbTestAction'

const routes = {
    'ws.hello_world': {
        path: '/',
        action: HelloWorldAction,
        method: 'GET'
    },
    'ws.db_test': {
        path: '/db',
        action: DbTestAction,
        method: 'GET'
    }
}

export { routes }
