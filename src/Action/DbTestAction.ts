import { v4 as uuid4 } from 'uuid'

import Action from '../Core/Route/Action'
import Container from '../Core/Container/Container'

export default new class DbTestAction extends Action {
    async execute(req, res) {
        const Database = Container.get('database')

        try {
            console.debug('>>> Trying to insert mock user')
            const uuid = uuid4().replace('-', '')
            await Database.insert('user', { email: `${ uuid }@test.example`, password: 'foo' })

            console.debug('>>> trying to update mock user')
            const email = uuid4().replace('-', '')
            await Database.update(
                'user',
                [
                    { column: 'id', value: '3d0d3fed-949b-49c2-9ceb-5b00166614c8' }
                ],
                { email }
            )

            console.debug('>>> Trying to execute test: SELECT * FROM `user`')
            return await Database.execute('SELECT * FROM `user`')
        } catch (err) {
            console.debug('>>> Query error: SELECT * FROM `user`', err)
            return err
        }

        return { error: true, message: 'jesus is watching you' }
    }

    options(): object {
        return {}
    }
}
