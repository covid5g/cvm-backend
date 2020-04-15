import Joi from '@hapi/joi'
import Action from '../../Core/Route/Action'

export default new class HelloWorldAction extends Action {
    execute(req, res): object {
        const { email, password } = req.payload

        return {
            error: null,
            message: 'Hello, World!'
        }
    }

    options(): object {
        return {
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().min(3).max(10),
                    password: Joi.string().min(4).max(4096)
                }).options({ stripUnknown: true })
            }
        }
    }

}
