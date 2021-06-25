import express from 'express';
import swaggerUi, { JsonObject } from 'swagger-ui-express';
import YAML from 'yamljs';
import usersRouter from './users/routes/';
import cardsRouter from './cards/routes/';
import authenticationsRouter from './authentications/routes';
import logger from './utils/logger';
// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment
const semver = require('semver');

const router = express.Router();

router.use((req, res, next) => {
    if (req.path.includes('swagger')) {
        next();
        return;
    }

    res.on('finish', () => {
        logger.info(`${req.url} ${res.statusCode}`, {
            body: req.body as JsonObject,
            params: req.params,
        });
    });

    const appVersion = req.header('app-version');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    if (!appVersion || semver.lt(appVersion, process.env.MIN_APP_VERSION)) {
        logger.warn(
            `app version (${appVersion ?? 'header not found'}) is lower than ${
                process.env.MIN_APP_VERSION ?? 'env not found'
            }`
        );
        res.sendStatus(426);
        return;
    }

    next();
});

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
    const swaggerDocument = YAML.load(
        __dirname + '/swagger.yaml'
    ) as JsonObject;
    router.use('/swagger', swaggerUi.serve);
    router.get('/swagger', swaggerUi.setup(swaggerDocument));
}

router.use(usersRouter);
router.use(cardsRouter);
router.use(authenticationsRouter);

export default router;
