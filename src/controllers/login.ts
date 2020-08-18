import {Request, Response} from "express";
import {LoginTicket, OAuth2Client} from "google-auth-library";
import {getRepository} from "typeorm";
import User from "../entities/user";
import {TokenPayload} from "google-auth-library/build/src/auth/loginticket";

export default class Login {
    public async google(req: Request, res: Response) {
        // authorize api people
        // https://www.googleapis.com/auth/userinfo.email
        // https://www.googleapis.com/auth/userinfo.profile
        // https://developers.google.com/oauthplayground/?code=4%2F3AGBGQHpE770vX7Q9F6fMqbmK0GICGHjA_ukApfZW_YLm6zC9TKwr6bd1iPQhi0kOMLbVsASJOIkPLHZ09lheSQ&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+openid&authuser=0&prompt=consent#

        const client = new OAuth2Client('407408718192.apps.googleusercontent.com');
        await client.verifyIdToken({
            idToken: req.body.idToken,
            audience: '407408718192.apps.googleusercontent.com',
        }).then(async (loginTicket :LoginTicket) => {
            const loginPayload = <TokenPayload> loginTicket.getPayload();

            if (!loginPayload.email) {
                throw new Error('Missing email in token');
            }
            if (!loginPayload.given_name) {
                throw new Error('Missing given_name in token');
            }
            if (!loginPayload.family_name) {
                throw new Error('Missing family_name in token');
            }

            const userRepository = getRepository(User);
            const user = await userRepository.findOne({
                where: {
                    email: loginPayload.email
                }
            });

            if (!user) {
                const userEntity = new User();
                userEntity.firstName = loginPayload.given_name;
                userEntity.lastName = loginPayload.family_name;
                userEntity.email = loginPayload.email;
                await userRepository.save(userEntity);
                res.status(201).json(userEntity);
            } else {
                res.status(200).json(user);
            }
        }).catch((error) => {
            res.status(401).json({
                'message': error.message
            });
        });
    }
}
