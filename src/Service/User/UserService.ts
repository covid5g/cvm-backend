import Database from '../../Core/Database/Database'
import Container from '../../Core/Container/Container'

import { hash, verify } from 'argon2'
import IUserForm from './IUserForm'

const T = {
    E_ALREADY_EXISTS: 'Exista deja un cont inregistrat cu aceasta adresa de e-mail.',
    E_NOT_FOUND: 'Adresa de e-mail sau parola este gresita.'
}

export default class UserService {
    #database: Database

    constructor() {
        this.#database = Container.get('database')
    }

    async login(userInfo: IUserForm) {
        const { email, password } = userInfo

        if (!await this.exists(email)) {
            throw new Error(T.E_NOT_FOUND)
        }

        try {
            const user = await this.#database.getEntity(
                'user',
                [ { column: 'email', value: email } ]
            )

            if (null === user) {
                throw new Error(T.E_NOT_FOUND)
            }

            if (!await verify(user.password, password)) {
                throw new Error(T.E_NOT_FOUND)
            }

            return {
                id: user.id,
                email: user.email
            }
        } catch (e) {
            throw e
        }
    }

    async register(userInfo: IUserForm) {
        const { email, password } = userInfo;

        if (await this.exists(email)) {
            throw new Error(T.E_ALREADY_EXISTS)
        }

        try {
            await this.#database.insert(
                'user',
                {
                    email,
                    password: await hash(password)
                }
            )
        } catch (e) {
            throw e
        }
    }

    async exists(email: string) {
        const count = await this.#database.count(
            'user',
            [ { column: 'email', value: email } ]
        );

        return count > 0
    }

    async validate(request: any, session: any) {
        const user = await this.get(session.email)

        console.debug(user)

        if (!user) {
            return { valid: false }
        }

        return {
            valid: true,
            credentials: {
                id: user.id,
                email: user.email
            }
        }
    }

    async get(email: string) {
        return await this.#database.getEntity(
            'user',
            [
                { column: 'email', value: email }
            ]
        )
    }
}
