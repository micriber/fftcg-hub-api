import {getRepository} from "typeorm";
import UserEntity from "../entities/user";
import {Request, Response} from "express";

export default class User {
    public async get(req: Request, res: Response) {
        if (!req.params.hasOwnProperty('id')){
            throw Error(`Query param id not found`);
        }

        const userRepository = getRepository(UserEntity);
        const user = await userRepository.findOne(req.params.id);

        if (!user) {
            res.status(404).json({
                'message' : 'user not found'
            })
        }

        res.status(200).json({
            'user' : user
        });
    }
}
