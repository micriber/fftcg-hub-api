import chai from 'chai';
import app from '../../src/app';
import chaiHttp = require("chai-http");

chai.use(chaiHttp);
const {expect, request} = chai;

describe('Controller users', async(): Promise<void> => {

    let server: ChaiHttp.Agent;

    before(async(): Promise<void> => {
        const startedApp = await app;
        server = request(startedApp).keepOpen();
    });

    after(async(): Promise<void> => {
        server.close();
    });

    describe('get', async (): Promise<void> => {
        it('should return a user', async(): Promise<void> => {
            server.get('/users').end((err, res): void => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.deep.equal({ message: 'success' });
            });
        });
    });

    describe('create', (): void => {
        it('should create a user', (): void => {

        });

        it('should create a user with error', (): void => {

        });
    });
});
