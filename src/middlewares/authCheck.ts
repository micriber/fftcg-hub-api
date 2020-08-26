import { Request, Response, NextFunction } from 'express';
import GoogleOAuth from "../services/googleOAuth";
import {TokenPayload} from "google-auth-library/build/src/auth/loginticket";
import JWT from "jsonwebtoken";

const authCheckMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.status(400).json({
            message: 'authorization header not found'
        });
        return;
    }

    const authorizationHeader = req.header('Authorization');
    const [type, jwt] = authorizationHeader!.split(' ');

    if (type !== 'bearer') {
        res.status(400).json({
            message: 'invalid authorization type'
        });
        return;
    }

    const jwtDecode = JWT.decode(jwt);

    if (!jwtDecode || typeof jwtDecode === "string") {
        res.status(401).json({
            'message': 'Invalid token'
        });
        return;
    }

    switch (jwtDecode.iss) {
        case 'https://accounts.google.com' :
            const googleOAuth = new GoogleOAuth();
            await googleOAuth.verifyIdToken(jwt, async (error: Error | null, tokenPayload?: TokenPayload) => {
                /* istanbul ignore next */
                if (error) {
                    res.status(401).json({
                        'message': 'Invalid token'
                    });
                    return;
                }

                // add check if user exist
                next();
            });
            break;
        default:
            res.status(401).json({
                'message': 'Invalid token'
            });
            return;
    }
};

export default authCheckMiddleware;
