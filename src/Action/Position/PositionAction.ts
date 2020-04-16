import Action from '../../Core/Route/Action'
import * as Joi from '@hapi/joi'
import LocationService from "../../Service/User/LocationService";

export default new class PositionAction extends Action {
    async execute(req, res) {
        const locationService = new LocationService();

        try {
            await locationService.insert(req.payload);
        } catch (error) {
            return {
                err: true,
                res: error
            }
        }

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
                }).options({stripUnknown: true})
            }
        }
    }
}
