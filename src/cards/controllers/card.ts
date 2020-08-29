import {Brackets, getRepository} from "typeorm";
import CardEntity from "../entities/card";
import {Request, Response} from "express";
import logger from '../../utils/logger';
import user from "../../users/services/user";

export default class Card {
    public async get(req: Request, res: Response) {
        const cardRepository = getRepository(CardEntity);
        const card = await cardRepository.findOne({ where: { code: req.params.code} }).catch((err) => {
            logger.error(err.message)
            res.status(400).json({
                'message' : err.message
            })
        });

        if (!card) {
            res.status(404).json({
                'message' : 'card not found'
            })
        }

        res.status(200).json(card);
    }

    public async getAll(req: Request, res: Response) {
        const cardRepository = getRepository(CardEntity);
        const { search, perPage, page } = req.query;
        const cardsQuery = cardRepository.createQueryBuilder('cards');

        cardsQuery.leftJoinAndSelect('cards.userCard', 'uc', 'cards.id = "uc"."cardId"');
        cardsQuery.leftJoin('users', 'u', '"uc"."userId" = u.id');
        cardsQuery.where('uc.quantity IS NUll or u.email = :email', {email: (await user.getCurrentUser(req)).email});
        cardsQuery.take(perPage ? +perPage : 10);
        cardsQuery.skip(page ? +page : 1);
        cardsQuery.orderBy({
            'cards.code': 'ASC',
        });

        if (search) {
            cardsQuery.andWhere(new Brackets(qb => {
                qb.where('unaccent(cards.code) ILIKE unaccent(:search)', { search: `%${search}%` })
                  .orWhere('unaccent(cards.name) ILIKE unaccent(:search)', { search: `%${search}%` })
            }))
        }

        const data = await cardsQuery.getManyAndCount();

        res.status(200).json({
            cards: data[0],
            page: page ? +page : 1,
            perPage: perPage ? +perPage : 10,
            total: data[1]
        });
    }
}
