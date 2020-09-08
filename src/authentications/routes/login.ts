import express, {Request, Response} from 'express';
import LoginController from '../controllers/login';

const router = express.Router();
const loginController = new LoginController();

router
    .post('/v1/login/google', (req: Request, res: Response) => loginController.google(req, res));

export default router;
