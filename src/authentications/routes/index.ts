import express from 'express';
import login from './login';

const router = express.Router();

router.use(login);

export default router;
