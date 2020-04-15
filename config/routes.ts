import HelloWorldAction from '../src/Action/HelloWorldAction'
import DbTestAction from '../src/Action/DbTestAction'
import RegisterAction from '../src/Action/User/RegisterAction'
import LoginAction from '../src/Action/User/LoginAction'
import PositionAction from '../src/Action/User/PositionAction'
import PositionGetAction from '../src/Action/Position/PositionGetAction'
import UserGetAction from '../src/Action/User/UserGetAction'

const routes = {
    '__MAIN__': {
        path: '/',
        action: HelloWorldAction,
        method: 'GET'
    },
    'ws.test.db': {
        path: '/test/db',
        action: DbTestAction,
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
    },
    'ws.user.position': {
        path: '/user/position',
        action: PositionAction,
        method: 'PUT'
    },
    'ws.position.get': {
        path: '/position/get',
        action: PositionGetAction,
        method: 'POST'
    },
    'ws.user.get': {
        path: '/user/get',
        action: UserGetAction,
        method: 'GET'
    }
}

export { routes }
