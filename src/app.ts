import { join } from 'path';
import express from 'express';
import router from './router';
import { Connection, createConnection, getConnectionOptions } from 'typeorm';
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
    let connection: Connection | undefined;

    try {
        const connectionOptions = await getConnectionOptions();
        Object.assign(connectionOptions, {
            database: database,
            entities: [join(__dirname, '**', 'entities', '**', '*.{ts,js}')],
            migrations: [
                join(__dirname, '**', 'migrations', '**', '*.{ts,js}'),
            ],
            subscribers: [
                join(__dirname, '**', 'subscribers', '**', '*.{ts,js}'),
            ],
        });
        connection = await createConnection(connectionOptions);

        app.use(express.json());
        app.use('/api', router);

        return app.listen(port, () => {
            logger.info(`server start with port ${port}`);
        });
    } catch (error) {
        if (connection) await connection.close();
        if (error instanceof Error) {
            logger.error(error.message);
        }
        throw error;
    }
}

export default start();
