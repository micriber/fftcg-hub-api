import { Request, Response } from 'express';
import Card from '../entities/card';
import UserCard from '../entities/userCard';
import { getRepository } from 'typeorm/index';
import addCard, { UserCardType } from '../schemas/userCard';

export default class userCard {
    public async add(req: Request, res: Response): Promise<void> {
        const result = addCard.validate(req.body);
        const error = result.error;
        const value = result.value as UserCardType;

        if (error) {
            res.status(400).json({ message: error.message });
            return;
        }

        try {
            const { card, userCard } = await this.getUserCard(req);
            const userCardRepository = getRepository(UserCard);

            if (!userCard) {
                const userCard = userCardRepository.create();
                userCard.card = card;
                userCard.quantity = value.quantity;
                userCard.version = value.version;
                userCard.user = req.user;

                await userCardRepository.save(userCard);
            } else {
                userCard.quantity += value.quantity;
                await userCardRepository.save(userCard);
            }

            res.sendStatus(200);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
                return;
            }
        }
    }

    public async subtract(req: Request, res: Response): Promise<void> {
        const result = addCard.validate(req.body);
        const error = result.error;
        const value = result.value as UserCardType;
        if (error) {
            res.status(400).json({ message: error.message });
            return;
        }

        const { userCard } = await this.getUserCard(req);
        const userCardRepository = getRepository(UserCard);

        if (!userCard) {
            res.status(400).json({
                message: "This user doesn't have this card",
            });
            return;
        }

        if (userCard.quantity === value.quantity) {
            await userCardRepository.remove(userCard);
        } else {
            userCard.quantity -= value.quantity;
            await userCardRepository.save(userCard);
        }

        res.sendStatus(200);
    }

    private async getUserCard(req: Request) {
        const card = await this.getCard(req);

        const userCardRepository = getRepository(UserCard);
        const userCard = await userCardRepository.findOne({
            relations: ['user', 'card'],
            where: {
                card: card,
                user: req.user,
                version: (req.body as UserCardType).version,
            },
        });

        return { card, userCard };
    }

    private async getCard(req: Request) {
        const card = await getRepository(Card).findOne({
            where: { code: req.params.code },
        });

        if (!card) {
            throw new Error('card not found');
        }

        return card;
    }
}
