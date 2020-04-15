import {Request, ResponseObject} from "@hapi/hapi"

export default abstract class Action {
    abstract options(): object

    abstract execute(req: Request, res: ResponseObject): void
}
