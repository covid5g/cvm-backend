import * as Joi from '@hapi/joi'
import Action from '../../Core/Route/Action'
import UserService from '../../Service/User/UserService'

export default new class LoginAction extends Action {
    async execute(req, res) {
        const userService = new UserService()

        const user = await userService.login(req.payload)

        req.cookieAuth.set(user)

        return {
            err: false,
            res: user
        }
    }

    options(): object {
        return {
            auth: false,
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().min(3),
                    password: Joi.string().min(4).max(4096)
                }).options({ stripUnknown: true })
            }
        }
    }

}
