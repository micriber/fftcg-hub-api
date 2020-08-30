import {Request, Response} from "express";
import {getRepository} from "typeorm";
import User from "../../users/entities/user";
import {TokenPayload} from "google-auth-library/build/src/auth/loginticket";
import GoogleOAuth from "../services/googleOAuth";
import googleLogin from "../schemas/googleLogin";

export default class Login {
    public async google(req: Request, res:  Response) {
        const {value, error} = googleLogin.validate(req.body);
        if (error) {
            res.status(400).json(error.message);
            return;
        }

        const googleOAuth = new GoogleOAuth();

        await googleOAuth.verifyIdToken(value.idToken, async (error: Error | null, tokenPayload?: TokenPayload) => {
            if (error) {
                res.status(401).json({
                    'message': 'Invalid token'
                });
                return
            }

            const userRepository = getRepository(User);
            const user = await userRepository.findOne({
                where: {
                    email: tokenPayload!.email
                }
            });

            if (user) {
                res.status(200).json(user);
            } else {
                const newUser = userRepository.create();
                newUser.firstName = <string>tokenPayload!.given_name;
                newUser.lastName = <string>tokenPayload!.family_name;
                newUser.email = <string>tokenPayload!.email;
                newUser.locale = <string>tokenPayload!.locale;
                newUser.authenticationType = 'google';

                await userRepository.save(newUser);

                res.status(201).json(newUser);
            }
        })
    }
}
