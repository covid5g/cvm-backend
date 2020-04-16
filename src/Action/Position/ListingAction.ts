import Action from '../../Core/Route/Action'
import * as Joi from '@hapi/joi'
import LocationService from "../../Service/User/LocationService";

export default new class ListingAction extends Action {
    async execute(req, res) {
        const locationService = new LocationService();

        try {
            return {
                err: false,
                res: await locationService.get(req.payload)
            }
        } catch (error) {
            return {
                err: true,
                res: error
            }
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
