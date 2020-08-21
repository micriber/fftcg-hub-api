import express from 'express';
import {Request, Response} from 'express';
import UserController from '../controllers/user';
import authCheckMiddleware from "../middlewares/authCheck";

const router = express.Router();
const userController = new UserController();

router
    .get('/v1/users/:id', [
        authCheckMiddleware,
        (req: Request, res: Response) => userController.get(req, res)
    ]);

export default router;
