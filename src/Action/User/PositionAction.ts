import Action from '../../Core/Route/Action'
import * as Joi from '@hapi/joi'

export default new class PositionAction extends Action {
    async execute(req, res) {
        return {
            err: false,
            res: 'PositionUpdate OK'
        }
    }

    options(): object {
        return {
            validate: {
                payload: Joi.object({
                    latitude: Joi.number().required(),
                    longitude: Joi.number().required()
                }).options({ stripUnknown: true })
            }
        }
    }
}
