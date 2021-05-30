import express, { Request, Response } from 'express';
import CardsController from '../controllers/card';
import authentication from '../../authentications/middlewares/authentication';

const router = express.Router();
const cardsController = new CardsController();

export interface CardRequest extends Request {
    query: {
        search?: string;
        owned?: string;
        page?: string;
        perPage?: string;
        types?: string;
        elements?: string;
        opus?: string;
        rarities?: string;
        categories?: string;
        cost?: string;
        power?: string;
    };
}

router
    .use('/v1/cards', authentication)
    .get('/v1/cards/:code', (req: Request, res: Response) =>
        cardsController.get(req, res)
    )
    .get('/v1/cards/', (req: CardRequest, res: Response) =>
        cardsController.getAll(req, res)
    );

export default router;
