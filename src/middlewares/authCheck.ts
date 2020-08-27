import { Request, Response, NextFunction } from 'express';
import GoogleOAuth from "../services/googleOAuth";
import {TokenPayload} from "google-auth-library/build/src/auth/loginticket";
import JWT from "jsonwebtoken";
import logger from "../services/logger";
import UserEntity from "../entities/user";
import {getRepository} from "typeorm/index";

function unauthorized(res: Response<any>) {
    res.status(401).json({
        'message': 'Invalid token'
    });
}

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
        logger.info('Auth : jwt decode null');
        return unauthorized(res);
    }

    switch (jwtDecode.iss) {
        case 'https://accounts.google.com' :
            const googleOAuth = new GoogleOAuth();
            await googleOAuth.verifyIdToken(jwt, async (error: Error | null, tokenPayload?: TokenPayload) => {
                /* istanbul ignore next */
                if (error) {
                    logger.error(error.message);
                    return unauthorized(res);
                }

                if (process.env.NODE_ENV !== 'test') {
                    const userRepository = getRepository(UserEntity);
                    const user = await userRepository.findOne({
                        where: {
                            email: tokenPayload!.email
                        }
                    }).catch((err) => {
                        logger.error(err.message);
                        return unauthorized(res);
                    })

                    if (!user) {
                        logger.info('Auth : user not found');
                        return unauthorized(res);
                    }
                }

                next();
            });
            break;
        default:
            logger.info('Auth : bad iss');
            return unauthorized(res);
    }
};

export default authCheckMiddleware;
