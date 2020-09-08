import JWT from "jsonwebtoken";
import {Request} from "express";

export default class Authentication {

    static getJWT(req: Request) :string {
        if (!req.headers.authorization) {
            throw new Error('authorization header not found');
        }

        const authorizationHeader = req.headers.authorization;
        const [type, jwt] = authorizationHeader.split(' ');

        if (type !== 'bearer') {
            throw new Error('invalid authorization type');
        }

        return jwt;
    }

    static decodeJWT(jwt: string) :{ [key: string]: string } {
        const jwtDecode = JWT.decode(jwt);

        if (!jwtDecode || typeof jwtDecode === "string") {
            throw new Error('Invalid token');
        }

        return jwtDecode;
    }

    static getDecodeJWT(req: Request) :{ [key: string]: string } {
        const jwt = this.getJWT(req);
        const jwtDecode = JWT.decode(jwt);

        if (!jwtDecode || typeof jwtDecode === "string") {
            throw new Error('Invalid token');
        }

        return jwtDecode;
    }
}
