import Action from '../Core/Route/Action'

export default new class AuthTestAction extends Action {
    execute(req, res): object {
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
