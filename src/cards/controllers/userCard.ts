import {Request, Response} from "express";
import Card from "../entities/card";
import UserCard from "../entities/userCard";
import User from "../../users/entities/user";
import {getRepository} from "typeorm/index";

export default class userCard {
    public async add(req: Request, res: Response) {
        const {card, userCard} = await this.getUserCard(req);
        const userCardRepository = await getRepository(UserCard);

        if (!userCard) {
            const userCard = userCardRepository.create();
            userCard.card = card;
            userCard.quantity = req.body.quantity;
            userCard.version = req.body.version;
            userCard.user = <User>req.app.get('user');

            userCardRepository.save(userCard);
        } else {
            userCard.quantity += req.body.quantity;
            userCardRepository.save(userCard);
        }

        res.sendStatus(200);
    }

    public async subtract(req: Request, res: Response) {
        const {userCard} = await this.getUserCard(req);
        const userCardRepository = await getRepository(UserCard);

        if (!userCard) {
            throw new Error("This user doesn't have this card" );
        }

        if (userCard.quantity === req.body.quantity) {
            await userCardRepository.remove(userCard);
        } else {
            userCard.quantity -= req.body.quantity;
            userCardRepository.save(userCard);
        }

        res.sendStatus(200);
    }

    private async getUserCard(req: Request) {
        const card = await this.getCard(req);

        const userCardRepository = await getRepository(UserCard);
        const userCard = await userCardRepository.findOne({
            relations: ['user', 'card'],
            where: {
                card: card,
                user: req.app.get('user'),
                version: req.body.version
            }
        });

        return {card, userCard};
    }


    private async getCard(req: Request) {
        const card = await getRepository(Card).findOne({
            where: {code: req.params.code}
        });

        if (!card) {
            throw new Error('card not found');
        }

        return card;
    }
}
