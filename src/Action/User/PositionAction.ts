import Action from '../../Core/Route/Action'

export default new class PositionAction extends Action {
    async execute(req, res) {
        return {
            err: false,
            res: {
                debug: true,
                isAuthenticated: req.auth.isAuthenticated,
                credentials: req.auth.credentials
            }
        }
    }

    options(): object {
        return {}
    }
}
