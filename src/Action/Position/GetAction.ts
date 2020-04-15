import Action from '../../Core/Route/Action'
import Container from '../../Core/Container/Container'

export default new class GetAction extends Action {
    async execute(req, res) {
        const Database = Container.get('database')

        const { latitude, longitude } = req.payload

        try {
            const userPositions = await Database.getCollection(
                'user_position',
                [ { column: 'user_id', value: res.auth.id } ]
            )

            return {
                err: false,
                res: userPositions
            }
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
