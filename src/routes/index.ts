import express from 'express';
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs';
import userRouter from './user';
import loginRouter from './login';
import cardRouter from './card';
import logger from "../services/logger";

const router = express.Router();

router.use((req, res, next) => {
    if (req.path.includes('swagger')) {
        next();
        return;
    }

    res.on('finish', () => {
        logger.info(req.url + ' ' + res.statusCode, {
            body: req.body,
            params: req.params,
        });
    });
    next();
});

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
