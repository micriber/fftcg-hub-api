import { Request, Response, NextFunction, RequestHandler } from 'express';
import GoogleOAuth from '../../authentications/services/googleOAuth';
import { TokenPayload } from 'google-auth-library/build/src/auth/loginticket';
import logger from '../../utils/logger';
import UserEntity from '../../users/entities/user';
import { getRepository } from 'typeorm/index';
import authentication from '../services/authentication';

const authenticationMiddleware: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const jwt = authentication.getJWT(req);
        const jwtDecode = authentication.decodeJWT(jwt);

        switch (jwtDecode.iss) {
            case 'https://accounts.google.com':
                await new GoogleOAuth().verifyIdToken(
                    jwt,
                    async (
                        error: Error | null,
                        tokenPayload?: TokenPayload
                    ) => {
                        /* istanbul ignore next */
                        if (error) {
                            logger.error(error.message);
                            res.status(401).json({
                                message: 'Invalid token',
                            });
                            return;
                        }

                        if (process.env.NODE_ENV !== 'test') {
                            try {
                                const userRepository = getRepository(
                                    UserEntity
                                );
                                const user = await userRepository.findOne({
                                    where: {
                                        email: tokenPayload?.email,
                                    },
                                });

                                if (!user) {
                                    logger.info('Auth : user not found');
                                    res.status(401).json({
                                        message: 'Invalid token',
                                    });
                                    return;
                                }
                                req.app.set('user', user);
                            } catch (error) {
                                if (error instanceof Error) {
                                    logger.error(error.message);
                                }
                                res.status(401).json({
                                    message: 'Invalid token',
                                });
                                return;
                            }
                        } else {
                            const user = await getRepository(
                                UserEntity
                            ).findOne();
                            req.app.set('user', user);
                        }

                        next();
                    }
                );
                break;
            default:
                logger.info('Auth : bad iss');
                res.status(401).json({
                    message: 'Invalid token',
                });
        }
    } catch (error) {
        if (error instanceof Error) {
            logger.error(error.message);
            res.status(401).json({
                message: error.message,
            });
        }
        return;
    }
};

export default authenticationMiddleware;
