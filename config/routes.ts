import HelloWorldAction from '../src/Action/HelloWorldAction'
import RegisterAction from '../src/Action/User/RegisterAction'
import LoginAction from '../src/Action/User/LoginAction'
import PositionAction from '../src/Action/Position/PositionAction'
import UserGetAction from '../src/Action/User/UserGetAction'
import ListingAction from '../src/Action/Position/ListingAction'
import GetBusyLocationsAction from "../src/Action/Position/GetBusyLocationsAction";

const routes = {
    '__MAIN__': {
        path: '/',
        action: HelloWorldAction,
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
    'ws.user.get': {
        path: '/user/get',
        action: UserGetAction,
        method: 'GET'
    },
    'ws.user.listing': {
        path: '/user/position/nearby',
        action: ListingAction,
        method: 'POST'
    },
    'ws.user.get.busy.points': {
        path: '/user/positions/check/busy',
        action: GetBusyLocationsAction,
        method: 'POST'
    }
};

export { routes }
