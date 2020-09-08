import express, {Request, Response} from 'express';
import UserController from '../controllers/user';
import authentication from "../../authentications/middlewares/authentication";

const router = express.Router();
const userController = new UserController();

router
    .use('/v1/users', authentication)
    .get('/v1/users/:id',(req: Request, res: Response) => userController.get(req, res));

export default router;
