import Action from '../Core/Route/Action'
import Container from '../Core/Container/Container'
import { DbQueryConditionType } from '../Core/Database/Database'

export default new class DbTestAction extends Action {
    async execute(req, res) {
        const Database = Container.get('database')

        const { email } = req.query

        try {
            if (email) {
                return await Database.getCollection(
                    'user',
                    [ {
                        column: 'email',
                        value: email,
                        condition: DbQueryConditionType.LIKE
                    } ]
                )
            }

            return await Database.getCollection('user')
        } catch (err) {
            console.debug('>>> Query error: ', err)
            return err
        }
    }

    options(): object {
        return {
            auth: false
        }
    }
}
