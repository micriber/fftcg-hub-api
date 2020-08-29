import {Request, Response} from "express";
import {getRepository} from "typeorm/index";
import Card from "../entities/card";
import UserCard, {version} from "../entities/userCard";
import user from "../../users/services/user";

export default class userCard {
    public async add(req: Request, res: Response) {
        const card = await getRepository(Card).findOne({
            where: {code: req.params.code}
        });

        if (!card) {
            throw new Error('card not found');
        }

        const userCard = new UserCard();
        userCard.card = card;
        userCard.quantity = 1;
        userCard.version = version.CLASSIC;
        userCard.user = await user.getCurrentUser(req);

        await getRepository(UserCard).save(userCard);

        res.status(200);
    }

    public async delete(req: Request, res: Response) {
        const card = await getRepository(Card).findOne({
            where: {code: req.params.code}
        });

        if (!card) {
            throw new Error('card not found');
        }

        const userCardRepository = await getRepository(UserCard);
        const userCard = await userCardRepository.findOne({
            where: {card: card}
        });

        if (!userCard) {
            throw new Error('card not found');
        }

        userCardRepository.remove(userCard);

        res.status(200);
    }
}
