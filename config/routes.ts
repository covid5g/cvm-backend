import HelloWorldAction from '../src/Action/HelloWorldAction'
import DbTestAction from '../src/Action/DbTestAction'
import RegisterAction from '../src/Action/User/RegisterAction'
import LoginAction from '../src/Action/User/LoginAction'
import AuthTestAction from '../src/Action/AuthTestAction'

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
    },
    'ws.auth_test': {
        path: '/auth',
        action: AuthTestAction,
        method: 'GET'
    },
    'ws.user.register': {
        path: '/user/register',
        action: RegisterAction,
        method: 'POST'
    },
    'ws.user.login': {
        path: '/user/login',
        action: LoginAction,
        method: 'POST'
    }
}

export { routes }
