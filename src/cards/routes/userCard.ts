import express from 'express';
import {Request, Response} from 'express';
import UserCard from '../controllers/userCard';
import authentication from "../../authentications/middlewares/authentication";

const router = express.Router();
const userCardController = new UserCard();

router
    .use('/v1/cards', authentication)
    .post('/v1/cards/:code/collection',(req: Request, res: Response) => userCardController.add(req, res))
    .delete('/v1/cards/:code/collection',(req: Request, res: Response) => userCardController.delete(req, res));

export default router;
