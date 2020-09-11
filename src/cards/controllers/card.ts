import { Request, Response } from 'express';
import { CardRepository, filters } from '../repositories/card';
import { getCustomRepository } from 'typeorm/index';
import User from '../../users/entities/user';

export default class Card {
    public async get(req: Request, res: Response): Promise<void> {
        const cardRepository: CardRepository = getCustomRepository(
            CardRepository
        );
        const card = await cardRepository.findByCode(
            req.params.code,
            req.app.get('user') as User
        );

        if (!card) {
            res.status(404).json({
                message: 'card not found',
            });
        }

        res.status(200).json(card);
    }

    public async getAll(req: Request, res: Response): Promise<void> {
        const cardRepository: CardRepository = getCustomRepository(
            CardRepository
        );
        const filter: filters = {};
        if (req.query.search) {
            filter.search = req.query.search as string;
        }
        const cards = await cardRepository.getAllCardsWithPagination(
            req.app.get('user') as User,
            filter,
            // @TODO : voir comment faire pour ne pas avoir a typer string undefined sur chaque query param
            req.query.page as string | undefined,
            req.query.perPage as string | undefined
        );

        res.status(200).json(cards);
    }
}
