import * as Joi from '@hapi/joi'
import Action from '../../Core/Route/Action'
import UserService from '../../Service/User/UserService'

export default new class RegisterAction extends Action {
    async execute(req, res) {
        const userService = new UserService()

        try {
            await userService.register(req.payload)

            return {
                err: false,
                res: userService.exists(req.payload.email)
            }
        } catch (e) {
            return {
                err: true,
                res: e.message
            }
        }
    }

    options(): object {
        return {
            auth: false,
            validate: {
                payload: Joi.object({
                    email: Joi.string().required(),
                    password: Joi.string().required().min(4).max(4096)
                }).options({ stripUnknown: true })
            }
        }
    }
}
