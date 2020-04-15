import Action from '../../Core/Route/Action'
import Container from '../../Core/Container/Container'

export default new class PositionGetAction extends Action {
    async execute(req, res) {
        const Database = Container.get('database')

        const userPositions = await Database.getCollection(
            'user_position',
            [ { column: 'user_id', value: res.auth.id } ]
        )

        return {
            err: false,
            res: userPositions
        }
    }

    options(): object {
        return {
            auth: false
        }
    }
}
