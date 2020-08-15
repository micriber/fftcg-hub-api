import {Request, Response} from 'express';
import {ContextInterface} from './interfaces/context';

export default class Context implements ContextInterface {
    private req: Request;

    private res: Response;

    public constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    public getBody(): object {
        return this.req.body;
    }

    public sendJson(code: number, json: object): void {
        this.res.status(code).json(json);
    }
}
