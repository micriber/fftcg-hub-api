import express from 'express';
import {Request, Response} from 'express';
import CardsController from '../controllers/card';
import authCheck from '../../users/middlewares/authCheck';

const router = express.Router();
const cardsController = new CardsController();

router
    .use('/v1/cards', authCheck)
    .get('/v1/cards/:code',(req: Request, res: Response) => cardsController.get(req, res))
    .get('/v1/cards/',(req: Request, res: Response) => cardsController.getAll(req, res));

export default router;
