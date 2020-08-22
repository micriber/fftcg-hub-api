import express from 'express';
import router from './routes';
import {createConnection, getConnectionOptions} from "typeorm";
import {Server} from 'http';

async function start(): Promise<Server> {
    /* istanbul ignore next */
    const port :number = (process.env.NODE_ENV === 'test') ? 2000 : 3000;
    /* istanbul ignore next */
    const database :string = ((process.env.NODE_ENV === 'test') ? process.env.POSTGRES_DB_TEST : process.env.POSTGRES_DB) || 'fftcg-application' ;

    const connectionOptions = await getConnectionOptions();
    Object.assign(connectionOptions, { database:  database});
    await createConnection(connectionOptions);

    const app = express();

    app.use(express.json());
    app.use('/api', router);

    return app.listen(port, () => {
        console.log('server start with port ' + port);
    });
}

export default start();
