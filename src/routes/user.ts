import express from 'express';
import {Request, Response} from 'express';
import UserController from '../controllers/user';
import authCheck from "../middlewares/authCheck";

const router = express.Router();
const userController = new UserController();

router
    .use('/v1/users', authCheck)
    .get('/v1/users/:id',(req: Request, res: Response) => userController.get(req, res));

export default router;
