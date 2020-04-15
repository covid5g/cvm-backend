import Action from '../../Core/Route/Action'
import * as Joi from '@hapi/joi'

export default new class ListingAction extends Action {
    async execute(req, res) {
        return {
            err: false,
            res: 'ListingAction OK'
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
