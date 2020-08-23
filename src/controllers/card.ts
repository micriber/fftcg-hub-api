import {getRepository} from "typeorm";
import CardEntity from "../entities/card";
import {Request, Response} from "express";

export default class Card {
    public async get(req: Request, res: Response) {
        const cardRepository = getRepository(CardEntity);
        const card = await cardRepository.findOne({ where: { code: req.params.code} });

        if (!card) {
            res.status(404).json({
                'message' : 'card not found'
            })
        }

        res.status(200).json(card);
    }

    public async getAll(req: Request, res: Response) {
        const cardRepository = getRepository(CardEntity);
        const cards = await cardRepository.createQueryBuilder('cards').paginate();

        res.status(200).json(cards);
    }
}
