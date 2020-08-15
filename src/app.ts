import express from 'express';
import router from './routes';
import {Server} from 'http';

async function start(): Promise<Server> {
    const app = express();
    const port :number = (process.env.NODE_ENV === 'test') ? 2000 : 3000;

    app.use(express.json());
    app.use(router);

    return app.listen(port);
}

export default start();
