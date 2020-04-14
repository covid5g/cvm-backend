import { Request, ResponseObject } from 'hapi'

export default interface IAction {
    options(): object

    execute(req: Request, res: ResponseObject): void
}
