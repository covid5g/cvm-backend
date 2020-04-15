import Action from '../../Core/Route/Action'
import UserService from '../../Service/User/UserService'

export default new class UserGetAction extends Action {
    async execute(req, res) {
        const userService = new UserService()

        return {
            err: false,
            res: await userService.get(req.auth.credentials.email)
        }
    }

    options(): object {
        return {}
    }
}
