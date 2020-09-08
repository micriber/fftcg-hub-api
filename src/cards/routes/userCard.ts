import express, {Request, Response} from 'express';
import UserCard from '../controllers/userCard';
import authentication from "../../authentications/middlewares/authentication";

const router = express.Router();
const userCardController = new UserCard();

router
    .use('/v1/cards', authentication)
    .post('/v1/cards/:code/add',(req: Request, res: Response) => userCardController.add(req, res))
    .post('/v1/cards/:code/subtract',(req: Request, res: Response) => userCardController.subtract(req, res));

export default router;
