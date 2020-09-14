import express from 'express';
import card from './card';
import userCard from './userCard';

const router = express.Router();

router.use(card).use(userCard);

export default router;
