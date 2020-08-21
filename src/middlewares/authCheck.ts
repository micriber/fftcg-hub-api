import { Request, Response, NextFunction } from 'express';
import GoogleOAuth from "../services/googleOAuth";
import {TokenPayload} from "google-auth-library/build/src/auth/loginticket";

const authCheckMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (req.path.includes('login') || req.path.includes('swagger') ) {
        next();
        return;
    }

    if (!req.headers.authorization) {
        res.status(400).json({
            message: 'authorization header not found'
        });
        return;
    }

    const authorizationHeader = req.header('Authorization');
    const token = authorizationHeader!.split(' ');

    if (token.length !== 2) {
        res.status(400).json({
            message: 'invalid authorization header'
        });
        return;
    }

    const type = token[0];
    const credentials = token[1];

    switch (type) {
        case 'google' :
            const googleOAuth = new GoogleOAuth();
            await googleOAuth.verifyIdToken(credentials, async (error: Error | null, tokenPayload?: TokenPayload) => {
                if (error) {
                    res.status(401).json({
                        'message': 'Invalid token'
                    });
                    return;
                }
                next();
            });
            break;
        default:
            res.status(400).json({
                message: 'invalid authorization type'
            });
            return;
    }
};

export default authCheckMiddleware;
