import express from 'express';
import router from './routes';
import {createConnection} from "typeorm";
import {Server} from 'http';

async function start(): Promise<Server> {
    const port :number = (process.env.NODE_ENV === 'test') ? 2000 : 3000;
    const connection :string = (process.env.NODE_ENV === 'test') ? 'test' : 'default';

    await createConnection(connection);
    const app = express();

    app.use(express.json());
    app.use(router);

    return app.listen(port);
}

export default start();
