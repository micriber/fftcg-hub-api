import {ContextInterface} from "../interfaces/context";
import {getRepository} from "typeorm";
import {User} from "../entities/user";

export default class Users {
    public async get(context: ContextInterface) {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne(context.getQueryParam('id'));

        if (!user) {
            context.sendJson(404, {
                'status' : 404,
                'message' : 'user not found'
            })
        }

        context.sendJson(200, {
            'status' : 200,
            'user' : user
        });
    }
}
