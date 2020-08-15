import express from 'express';
import {Request, Response} from 'express';
import UsersController from '../controllers/users';
import Context from '../context';

const router = express.Router();
const controller = new UsersController();

router
    .get('/users', (req: Request, res: Response): void => controller.get(new Context(req, res)));

export default router;
