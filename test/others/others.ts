import * as chai from 'chai';
import app from '../../src/app';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect, request } = chai;

describe('Others', () => {
    let server: ChaiHttp.Agent;

    before(
        async (): Promise<void> => {
            const startedApp = await app;
            server = request(startedApp).keepOpen();
        }
    );

    after(() => {
        server.close();
    });

    it('should return a swagger documentation', async (): Promise<void> => {
        await server.get('/api/swagger').then((res): void => {
            expect(res.error).to.be.false;
            expect(res).to.have.status(200);
        });
    });

    it('should return a health check', async (): Promise<void> => {
        await server.get('/api/healthCheck').then((res): void => {
            expect(res.error).to.be.false;
            expect(res).to.have.status(200);
        });
    });
});
