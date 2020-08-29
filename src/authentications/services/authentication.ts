import JWT from "jsonwebtoken";
import {Request} from "express";

export default class Authentication {

    static getJWT(req: Request) :string {
        if (!req.headers.authorization) {
            throw new Error('authorization header not found');
        }

        const authorizationHeader = req.header('Authorization');
        const [type, jwt] = authorizationHeader!.split(' ');

        if (type !== 'bearer') {
            throw new Error('invalid authorization type');
        }

        return jwt;
    }

    static decodeJWT(jwt: string) :{ [key: string]: any } {
        const jwtDecode = JWT.decode(jwt);

        if (!jwtDecode || typeof jwtDecode === "string") {
            throw new Error('Invalid token');
        }

        return jwtDecode;
    }

    static getDecodeJWT(req: Request) :{ [key: string]: any } {
        const jwt = this.getJWT(req);
        const jwtDecode = JWT.decode(jwt);

        if (!jwtDecode || typeof jwtDecode === "string") {
            throw new Error('Invalid token');
        }

        return jwtDecode;
    }
}
