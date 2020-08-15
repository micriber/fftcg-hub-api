import {ContextInterface} from "../interfaces/context";

export default class Users {
    public get(context: ContextInterface): void {
        context.sendJson(200, { message: 'success' });
    }
}
