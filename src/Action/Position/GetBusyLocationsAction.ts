import Action from '../../Core/Route/Action'
import * as Joi from '@hapi/joi'
import LocationService from "../../Service/User/LocationService";

export default new class GetBusyLocationsAction extends Action {
    async execute(req, res) {
        const locationService = new LocationService();
        const busyLocationNumbers = {
            "crowded": 50,
            "some": 10
        };

        try {
            let result = [];
            let point;
            for (const point of req.payload) {
                console.log(point);
                const foundUsers = await locationService.get(point);
                const numberOfUsersInProximity = foundUsers.length;

                result.push({
                    identifier: point.identifier,
                    status: (numberOfUsersInProximity >= busyLocationNumbers['crowded']) ?
                        'crowded' :
                        (numberOfUsersInProximity >= busyLocationNumbers['some']
                        && numberOfUsersInProximity <= busyLocationNumbers['crowded'] ? 'some' : 'ok')
                });
            }

            return {
                err: false,
                res: result
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
                payload: Joi.array().items(Joi.object().keys({
                    identifier: Joi.string().required(),
                    latitude: Joi.number().required(),
                    longitude: Joi.number().required()
                }).options({stripUnknown: true}))
            }
        }
    }
}
