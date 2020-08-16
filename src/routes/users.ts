import express from 'express';
import {Request, Response} from 'express';
import UsersController from '../controllers/users';
import Context from '../context';

const router = express.Router();
const controller = new UsersController();

router
    .get('/users/:id', (req: Request, res: Response) => controller.get(new Context(req, res)));

export default router;
