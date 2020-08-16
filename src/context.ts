import {Request, Response} from 'express';
import {ContextInterface} from './interfaces/context';

export default class Context implements ContextInterface {
    private req: Request;

    private res: Response;

    public constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    public getQueryParam(name: string): string {
        if (!this.req.params.hasOwnProperty(name)){
            throw Error(`Query param "${name}" not found`);
        }

        return this.req.params[name];
    }

    public getQueryParams(): Record<string, string> {
        return this.req.params;
    }

    public getBody(): Record<string, unknown> {
        return this.req.body;
    }

    public sendJson(code: number, json: Record<string, unknown>): void {
        this.res.status(code).json(json);
    }
}
