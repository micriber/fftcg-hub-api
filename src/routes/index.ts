import express from 'express';
import userRouter from './user';
import loginRouter from './login';

const router = express.Router();

router.use(userRouter);
router.use(loginRouter);

export default router;
