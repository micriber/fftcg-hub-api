import * as chai from 'chai';
import app from '../../src/app';
import chaiHttp = require("chai-http");
import {getRepository} from "typeorm";
import User from "../../src/users/entities/user";
import * as JWT from "jsonwebtoken";

chai.use(chaiHttp);
const {expect, request} = chai;
const authorizationHeader = 'bearer ' + JWT.sign({iss: 'https://accounts.google.com'}, 'test');

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
        it('authorization header not found', async(): Promise<void> => {
            await server.get('/api/v1/users/caa8b54a-eb5e-4134-8ae2-a3946a428ec7').then((res): void => {
                expect(res).to.have.status(400);
                expect(res.body.message).to.be.equal('authorization header not found');
            });
        });

        it('invalid authorization header', async(): Promise<void> => {
            await server.get('/api/v1/users/caa8b54a-eb5e-4134-8ae2-a3946a428ec7').set('authorization', 'bea rer 1').then((res): void => {
                expect(res).to.have.status(400);
                expect(res.body.message).to.be.equal('invalid authorization type');
            });
        });

        it('invalid token', async(): Promise<void> => {
            await server.get('/api/v1/users/caa8b54a-eb5e-4134-8ae2-a3946a428ec7').set('authorization', 'bearer badJwtToken').then((res): void => {
                expect(res).to.have.status(401);
                expect(res.body.message).to.be.equal('Invalid token');
            });
        });

        it('invalid iss in token', async(): Promise<void> => {
            await server.get('/api/v1/users/caa8b54a-eb5e-4134-8ae2-a3946a428ec7').set('authorization', 'bearer ' + JWT.sign({iss: 'https://toto.com'}, 'test')).then((res): void => {
                expect(res).to.have.status(401);
                expect(res.body.message).to.be.equal('Invalid token');
            });
        });

        it('should return a user', async(): Promise<void> => {
            const databaseUser =  await getRepository(User).findOne();
            await server.get('/api/v1/users/'+databaseUser!.id).set('authorization', authorizationHeader).then((res): void => {
                expect(res.error).to.be.false;
                expect(res).to.have.status(200);
                const user = res.body;
                expect(user.firstName).to.be.equal('firstName1');
                expect(user.lastName).to.be.equal('lastName1');
                expect(user.email).to.be.equal('email1@gmail.com');
                expect(user.locale).to.be.equal('fr');
            });
        });

        it('user not exist', async(): Promise<void> => {
            await server.get('/api/v1/users/caa8b54a-eb5e-4134-8ae2-a3946a428ec7').set('authorization', authorizationHeader).then((res): void => {
                expect(res).to.have.status(404);
                expect(res.body.message).to.be.equal('user not found');
            });
        });
    });
});
