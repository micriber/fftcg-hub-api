export interface ContextInterface {
    getBody(): Record<string, unknown>;
    sendJson(code: number, json: Record<string, unknown>): void;
}
