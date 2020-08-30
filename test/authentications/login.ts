import chai from 'chai';
import app from '../../src/app';
import chaiHttp = require("chai-http");
import loadFixtures from "../fixture";

chai.use(chaiHttp);
const {expect, request} = chai;

describe('Login', async(): Promise<void> => {

    let server: ChaiHttp.Agent;

    before(async(): Promise<void> => {
        const startedApp = await app;
        server = request(startedApp).keepOpen();
    });

    beforeEach(async(): Promise<void> => {
        await loadFixtures();
    });

    after(async(): Promise<void> => {
        server.close();
    });

    describe('POST /login/google', async (): Promise<void> => {
        it('bad token', async(): Promise<void> => {
            await server.post('/api/v1/login/google', ).send({
                idToken: 'badIdToken'
            }).then((res): void => {
                expect(res).to.have.status(401);
                expect(res.body.message).to.be.equal('Invalid token');
            });
        });
        it('should login a user', async(): Promise<void> => {
            await server.post('/api/v1/login/google', ).send({
                idToken: '1'
            }).then((res): void => {
                expect(res.error).to.be.false;
                expect(res).to.have.status(200);
                expect(res.body.email).to.be.equal('email1@gmail.com');
            });
        });
        it('should create a user', async(): Promise<void> => {
            const token = Date.now();
            await server.post('/api/v1/login/google', ).send({
                idToken: token
            }).then((res): void => {
                expect(res.error).to.be.false;
                expect(res).to.have.status(201);
                expect(res.body.email).to.be.equal(`email${token}@gmail.com`);
            });
        });
    });
});
