import {Request} from "express";
import {getRepository} from "typeorm/index";
import UserEntity from "../entities/user";
import logger from "../../utils/logger";
import authentication from "../../authentications/services/authentication";

export default class User {
    static async getCurrentUser(req: Request) :Promise<UserEntity> {
        const decodeJWT = authentication.getDecodeJWT(req);
        const userRepository = getRepository(UserEntity);
        const user = await userRepository.findOne({
            where: {
                email: decodeJWT.email
            }
        }).catch((err) => {
            logger.error(err.message);
        })

        if (!user) {
            logger.info('user not found');
            throw new Error('user not found');
        }

        return user;
    }
}
