import Database from '../../Core/Database/Database'
import Container from '../../Core/Container/Container'
import {v4 as uuid4} from 'uuid'
import IPositionForm from './IPositionForm'

const T = {
    E_ALREADY_EXISTS: 'Exista deja un cont inregistrat cu aceasta adresa de e-mail.',
    E_NOT_FOUND: 'Adresa de e-mail sau parola este gresita.'
}

export default class LocationService {
    #database: Database

    constructor() {
        this.#database = Container.get('database')
    }

    async insert(positionInfo: IPositionForm) {
        const {latitude, longitude} = positionInfo;
        const id = uuid4();
        // @ts-ignore
        const isSuspect = positionInfo.isSuspect ? 1 : 0;

        try {
            await this.#database.execute(
                `INSERT INTO location (id, location, is_suspect) VALUES ('${id}', Point(${latitude}, ${longitude}), ${isSuspect})`
            )
        } catch (e) {
            throw e
        }
    }

    async get(position: IPositionForm, searchRange: number = 2) {
        return await this.#database.execute(
            `SELECT
                      ST_X(location) AS latitude,
                      ST_Y(location) AS longitude,
                      is_suspect,
                       (
                        6371 * acos (
                          cos ( radians(${position.latitude}) )
                          * cos( radians( ST_X(location) ) )
                          * cos( radians( ST_Y(location ) ) - radians(${position.longitude}) )
                          + sin ( radians(${position.latitude}) )
                          * sin( radians( ST_X(location )) )
                        )
                      ) AS \`distance\`
                    FROM location
                    HAVING distance < ${searchRange}
                    ORDER BY distance;`
        )
    }
}
