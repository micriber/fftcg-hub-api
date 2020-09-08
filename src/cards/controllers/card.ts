import {Request, Response} from "express";
import {CardRepository, filters} from "../repositories/card";
import {getCustomRepository} from "typeorm/index";
import User from "../../users/entities/user";



export default class Card {
    public async get(req: Request, res: Response) : Promise<void> {
        const cardRepository :CardRepository = getCustomRepository(CardRepository);
        const card = await cardRepository.findByCode(req.params.code, <User>req.app.get('user'));

        if (!card) {
            res.status(404).json({
                'message' : 'card not found'
            })
        }

        res.status(200).json(card);
    }

    public async getAll(req: Request, res: Response) : Promise<void> {
        const cardRepository :CardRepository = getCustomRepository(CardRepository);
        const filter: filters = {};
        if (req.query.search) {
            filter.search = <string>req.query.search;
        }
        const cards = await cardRepository.getAllCardsWithPagination(
            <User>req.app.get('user'),
            filter,
            // @TODO : voir comment faire pour ne pas avoir a typer string undefined sur chaque query param
            <string|undefined>req.query.page,
            <string|undefined>req.query.perPage,
        );

        res.status(200).json(cards);
    }
}
