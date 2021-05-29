import chai from 'chai';
import app from '../../src/app';
import chaiHttp = require('chai-http');
import loadFixtures from '../fixture';
import { ErrorMessageType } from '../../src/utils/error';
import User from '../../src/users/entities/user';

chai.use(chaiHttp);
const { expect, request } = chai;

describe('Login', () => {
    let server: ChaiHttp.Agent;

    before(async function (): Promise<void> {
        this.timeout(5000);
        const startedApp = await app;
        server = request(startedApp).keepOpen();
    });

    beforeEach(
        async (): Promise<void> => {
            await loadFixtures();
        }
    );

    after(() => {
        server.close();
    });

    describe('POST /login/google', () => {
        it('bad token', async (): Promise<void> => {
            await server
                .post('/api/v1/login/google')
                .send({
                    idToken: 'badIdToken',
                })
                .then((res): void => {
                    expect(res).to.have.status(401);
                    expect((res.body as ErrorMessageType).message).to.be.equal(
                        'Invalid token'
                    );
                });
        });
        it('should login a user', async (): Promise<void> => {
            await server
                .post('/api/v1/login/google')
                .send({
                    idToken: '1',
                })
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);
                    expect((res.body as User).email).to.be.equal(
                        'email1@gmail.com'
                    );
                });
        });
        it('should create a user', async (): Promise<void> => {
            const token = Date.now();
            await server
                .post('/api/v1/login/google')
                .send({
                    idToken: token.toString(),
                })
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(201);
                    expect((res.body as User).email).to.be.equal(
                        `email${token}@gmail.com`
                    );
                });
        });
        it('should authenticate a user without lastName', async (): Promise<void> => {
            const token = Date.now();
            await server
                .post('/api/v1/login/google')
                .send({
                    idToken: '4',
                })
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);
                    expect((res.body as User).email).to.be.equal(
                        `email4@gmail.com`
                    );
                    expect((res.body as User).firstName).to.be.equal(
                        `iHaveFirstName`
                    );
                    expect((res.body as User).lastName).to.be.null;
                });
        });
        it('should authenticate a user without firstName', async (): Promise<void> => {
            const token = Date.now();
            await server
                .post('/api/v1/login/google')
                .send({
                    idToken: '5',
                })
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);
                    expect((res.body as User).email).to.be.equal(
                        `email5@gmail.com`
                    );
                    expect((res.body as User).firstName).to.be.null;
                    expect((res.body as User).lastName).to.be.equal('iHaveLastName');
                });
        });
    });
});
