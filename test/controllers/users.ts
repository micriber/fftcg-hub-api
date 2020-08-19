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

    describe('GET /users/{userId}', async (): Promise<void> => {
        it('should return a user', async(): Promise<void> => {
            await server.get('/api/v1/users/1').then((res): void => {
                expect(res.error).to.be.false;
                expect(res).to.have.status(200);
                const user = res.body.users;
                expect(user.id).to.be.equal(1);
                expect(user.firstName).to.be.equal('firstName1');
                expect(user.lastName).to.be.equal('lastName1');
                expect(user.email).to.be.equal('email1@gmail.com');
                expect(user.locale).to.be.equal('fr');
            });
        });

        it('should return a user with user not exist', async(): Promise<void> => {
            await server.get('/api/v1/users/99999').then((res): void => {
                expect(res).to.have.status(404);
                expect(res.body.message).to.be.equal('user not found');
            });
        });
    });
});
