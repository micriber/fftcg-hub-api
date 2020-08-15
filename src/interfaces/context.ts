export interface ContextInterface {
    getBody(): object;
    sendJson(code: number, json: object): void;
}
