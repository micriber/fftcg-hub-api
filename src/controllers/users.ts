import {getRepository} from "typeorm";
import {User} from "../entities/user";
import {Request, Response} from "express";

export default class Users {
    public async get(req: Request, res: Response) {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne(req.params.idf);

        if (!user) {
            res.status(404).json({
                'message' : 'user n1ot found'
            })
        }

        res.status(200).json({
            'user' : user
        });
    }
}
