import express from 'express';
import card from './card'

const router = express.Router();

router
    .use(card);

export default router;
