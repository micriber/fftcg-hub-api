import express from 'express';
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs';
import usersRouter from './users/routes/';
import cardsRouter from './cards/routes/';
import authenticationsRouter from "./authentications/routes";
import logger from './utils/logger';

const router = express.Router();

router.use((req, res, next) => {
    if (req.path.includes('swagger')) {
        next();
        return;
    }

    res.on('finish', () => {
        logger.info(`${req.url} ${res.statusCode}`, {
            body: req.body,
            params: req.params,
        });
    });
    next();
});

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
    const swaggerDocument = YAML.load(__dirname + '/swagger.yaml');
    router.use('/swagger', swaggerUi.serve);
    router.get('/swagger', swaggerUi.setup(swaggerDocument));
}

router.use(usersRouter);
router.use(cardsRouter);
router.use(authenticationsRouter);

export default router;
