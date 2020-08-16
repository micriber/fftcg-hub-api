export interface ContextInterface {
    getQueryParam(name?: string): string;
    getQueryParams(): Record<string, string>;
    getBody(): Record<string, unknown>;
    sendJson(code: number, json: Record<string, unknown>): void;
}
