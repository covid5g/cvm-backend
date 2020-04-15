import { Request } from '@hapi/hapi'
import { ResponseToolkit } from 'hapi'

export default abstract class Action {
    abstract options(): object

    abstract execute(req: Request, res: ResponseToolkit): void
}
