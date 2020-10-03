import { Request, Response } from 'express';
import { CardRepository, filters } from '../repositories/card';
import { getCustomRepository } from 'typeorm/index';
import { CardRequest } from '../routes/card';

export default class Card {
    public async get(req: Request, res: Response): Promise<void> {
        const cardRepository: CardRepository = getCustomRepository(
            CardRepository
        );
        const card = await cardRepository.findByCode(req.params.code, req.user);

        if (!card) {
            res.status(404).json({
                message: 'card not found',
            });
        }

        res.status(200).json(card);
    }

    public async getAll(req: CardRequest, res: Response): Promise<void> {
        const cardRepository: CardRepository = getCustomRepository(
            CardRepository
        );
        const filter: filters = {};
        if (req.query.search) {
            filter.search = req.query.search;
        }
        await cardRepository
            .getAllCardsWithPagination(
                req.user,
                filter,
                req.query.page,
                req.query.perPage
            )
            .then((cards) => {
                res.status(200).json(cards);
            });
    }
}
