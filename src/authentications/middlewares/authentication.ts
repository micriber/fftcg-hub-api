import { Request, Response, NextFunction } from 'express';
import GoogleOAuth from "../../authentications/services/googleOAuth";
import {TokenPayload} from "google-auth-library/build/src/auth/loginticket";
import logger from "../../utils/logger";
import UserEntity from "../../users/entities/user";
import {getRepository} from "typeorm/index";
import authentication from "../services/authentication";

const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jwt = authentication.getJWT(req);
        const jwtDecode = authentication.decodeJWT(jwt);

        switch (jwtDecode.iss) {
            case 'https://accounts.google.com' :
                const googleOAuth = new GoogleOAuth();
                await googleOAuth.verifyIdToken(jwt, async (error: Error | null, tokenPayload?: TokenPayload) => {
                    /* istanbul ignore next */
                    if (error) {
                        logger.error(error.message);
                        res.status(401).json({
                            message: 'Invalid token'
                        });
                        return;
                    }

                    if (process.env.NODE_ENV !== 'test') {
                        const userRepository = getRepository(UserEntity);
                        const user = await userRepository.findOne({
                            where: {
                                email: tokenPayload!.email
                            }
                        }).catch((err) => {
                            logger.error(err.message);
                            res.status(401).json({
                                message: 'Invalid token'
                            });
                            return;
                        })

                        if (!user) {
                            logger.info('Auth : user not found');
                            res.status(401).json({
                                message: 'Invalid token'
                            });
                            return;
                        }
                        req.app.set('user', user);
                    } else {
                        const user = await getRepository(UserEntity).findOne();
                        req.app.set('user', user);
                    }

                    next();
                });
                break;
            default:
                logger.info('Auth : bad iss');
                res.status(401).json({
                    message: 'Invalid token'
                });
        }
    } catch (error) {
        res.status(401).json({
            message: error.message
        });
        return;
    }

};

export default authenticationMiddleware;
