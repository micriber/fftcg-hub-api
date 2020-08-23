import chai from 'chai';
import app from '../../src/app';
import chaiHttp = require("chai-http");
import {getRepository} from "typeorm";
import User from "../../src/entities/user";
import JWT from "jsonwebtoken";
import Card from "../../src/entities/card";

chai.use(chaiHttp);
const {expect, request} = chai;
const authorizationHeader = 'bearer ' + JWT.sign({iss: 'https://accounts.google.com'}, 'test');

describe('Controller cards', async(): Promise<void> => {

    let server: ChaiHttp.Agent;

    before(async(): Promise<void> => {
        const startedApp = await app;
        server = request(startedApp).keepOpen();
    });

    after(async(): Promise<void> => {
        server.close();
    });

    describe('GET /cards', async (): Promise<void> => {
        it('should return pagination of all card', async(): Promise<void> => {
            const databaseCard =  await getRepository(Card).find();
            await server.get('/api/v1/cards').set('authorization', authorizationHeader).then((res): void => {
                expect(res.error).to.be.false;
                expect(res).to.have.status(200);
                expect(res.body.total).to.be.equal(databaseCard!.length);
                const card = res.body.data[0];
                expect(card.code).to.be.equal(databaseCard![0].code);
                expect(card.rarity).to.be.equal(databaseCard![0].rarity);
                expect(card.name).to.be.equal(databaseCard![0].name);
                expect(card.text).to.be.equal(databaseCard![0].text);
            });
        });
    });

    describe('GET /cards/{code}', async (): Promise<void> => {
        it('should return a card', async(): Promise<void> => {
            const databaseCard =  await getRepository(Card).findOne();
            await server.get('/api/v1/cards/'+databaseCard!.code).set('authorization', authorizationHeader).then((res): void => {
                expect(res.error).to.be.false;
                expect(res).to.have.status(200);
                const card = res.body;
                expect(card.code).to.be.equal(databaseCard!.code);
                expect(card.rarity).to.be.equal(databaseCard!.rarity);
                expect(card.name).to.be.equal(databaseCard!.name);
                expect(card.text).to.be.equal(databaseCard!.text);
            });
        });

        it('card not exist', async(): Promise<void> => {
            await server.get('/api/v1/cards/codeDontExist').set('authorization', authorizationHeader).then((res): void => {
                expect(res).to.have.status(404);
                expect(res.body.message).to.be.equal('card not found');
            });
        });
    });
});
