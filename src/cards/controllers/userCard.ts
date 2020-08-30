import {Request, Response} from "express";
import Card from "../entities/card";
import UserCard from "../entities/userCard";
import User from "../../users/entities/user";
import {getRepository} from "typeorm/index";
import addCard from '../schemas/userCard';

export default class userCard {
    public async add(req: Request, res: Response) {
        const {value, error} = addCard.validate(req.body);
        if (error) {
            res.status(400).json(error.message);
            return;
        }

        const {card, userCard} = await this.getUserCard(req);
        const userCardRepository = await getRepository(UserCard);

        if (!userCard) {
            const userCard = userCardRepository.create();
            userCard.card = card;
            userCard.quantity = value.quantity;
            userCard.version = value.version;
            userCard.user = <User>req.app.get('user');

            userCardRepository.save(userCard);
        } else {
            userCard.quantity += value.quantity;
            userCardRepository.save(userCard);
        }

        res.sendStatus(200);
    }

    public async subtract(req: Request, res: Response) {
        const {value, error} = addCard.validate(req.body);
        if (error) {
            res.status(400).json(error.message);
            return;
        }

        const {userCard} = await this.getUserCard(req);
        const userCardRepository = await getRepository(UserCard);

        if (!userCard) {
            throw new Error("This user doesn't have this card" );
        }

        if (userCard.quantity === value.quantity) {
            await userCardRepository.remove(userCard);
        } else {
            userCard.quantity -= value.quantity;
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
