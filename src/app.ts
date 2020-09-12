import express from 'express';
import router from './router';
import { createConnection, getConnectionOptions } from 'typeorm';
import { Server } from 'http';
import logger from './utils/logger';

async function start(): Promise<Promise<Server> | void> {
    /* istanbul ignore next */
    const port: number = process.env.NODE_ENV === 'test' ? 2000 : 3000;
    /* istanbul ignore next */
    const database: string =
        (process.env.NODE_ENV === 'test'
            ? process.env.POSTGRES_DB_TEST
            : process.env.POSTGRES_DB) || 'fftcg-application';

    const app = express();

    try {
        const connectionOptions = await getConnectionOptions();
        Object.assign(connectionOptions, { database: database });
        await createConnection(connectionOptions);

        app.use(express.json());
        app.use('/api', router);

        return app.listen(port, () => {
            logger.info(`server start with port ${port}`);
        });
    } catch (err) {
        logger.error(err);
        app.response.sendStatus(500);
    }
}

export default start();
