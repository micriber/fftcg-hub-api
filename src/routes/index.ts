import express from 'express';
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs';
import userRouter from './user';
import loginRouter from './login';
import cardRouter from './card';

const router = express.Router();

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
    const swaggerDocument = YAML.load(__dirname + '/../swagger.yaml');
    router.use('/swagger', swaggerUi.serve);
    router.get('/swagger', swaggerUi.setup(swaggerDocument));
}

router.use(userRouter);
router.use(loginRouter);
router.use(cardRouter);

export default router;
