import { Request, Response } from 'express';
import { CardRepository, Filters } from '../repositories/card';
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
        const filter: Filters = {
            ...(req.query.search ? { search: req.query.search } : {}),
            ...(req.query.owned ? { owned: req.query.owned === 'true' } : {}),
            ...(req.query.types ? { types: req.query.types.split(',') } : {}),
            ...(req.query.elements ? { elements: req.query.elements?.split(',') } : {}),
            ...(req.query.opus ? { opus: req.query.opus.split(',').map(opus => opus.replace('_', ' ')) } : {}),
            ...(req.query.rarities ? { rarities: req.query.rarities.split(',') } : {}),
            ...(req.query.categories ? { categories: req.query.categories.split(',') } : {}),
            ...(req.query.cost ? { cost: req.query.cost.split(',').map(cost => +cost) } : {}),
            ...(req.query.power ? { power: req.query.power.split(',').map(power => +power) } : {}),
        };
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
