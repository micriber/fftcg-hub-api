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
            server.get('/users/1').end((err, res): void => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                const user = res.body.user;
                expect(user.id).to.be.equal(1);
                expect(user.firstName).to.be.equal('Bersiroth');
                expect(user.lastName).to.be.equal('Masamune');
            });
        });

        it('should return a user with user not exist', async(): Promise<void> => {
            server.get('/users/99999').end((err, res): void => {
                expect(err).to.be.null;
                expect(res).to.have.status(404);
                expect(res.body.message).to.be.equal('user not found');
            });
        });
    });

    describe('create', (): void => {
        it('should create a user', (): void => {
            // implement in next commit with DB
        });

        it('should create a user with error', (): void => {
            // implement in next commit with DB
        });
    });
});
