import chai from 'chai';
import app from '../../src/app';
import chaiHttp = require("chai-http");
import {getRepository} from "typeorm";
import * as JWT from "jsonwebtoken";
import Card from "../../src/cards/entities/card";
import loadFixtures from '../fixture';

chai.use(chaiHttp);
const {expect, request} = chai;
const authorizationHeader = 'bearer ' + JWT.sign({iss: 'https://accounts.google.com'}, 'test');

describe('User cards', async(): Promise<void> => {

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

    describe('POST /cards/{code}/add', async (): Promise<void> => {
        it('should add a first card to collection', async(): Promise<void> => {
            const sephiroth = await getRepository(Card).findOne({
                where : {name: 'Séphiroth'}
            });
            await server.get('/api/v1/cards/'+sephiroth!.code).set('authorization', authorizationHeader).then((res): void => {
                expect(res.error).to.be.false;
                expect(res).to.have.status(200);
                const card = res.body;
                expect(card.userCard.length).to.be.equal(0);
                expect(card.name).to.be.equal(sephiroth!.name);
            });

            await server.post(`/api/v1/cards/${sephiroth!.code}/add`).set('authorization', authorizationHeader).send({
                quantity: 1,
                version: 'classic'
            }).then((res): void => {
                expect(res.error).to.be.false;
                expect(res).to.have.status(200);
            });

            await server.get('/api/v1/cards/'+sephiroth!.code).set('authorization', authorizationHeader).then((res): void => {
                expect(res.error).to.be.false;
                expect(res).to.have.status(200);
                const card = res.body;
                expect(card.userCard[0].quantity).to.be.equal(1);
                expect(card.userCard[0].version).to.be.equal('classic');
                expect(card.name).to.be.equal(sephiroth!.name);
            });
        });

        it('should add a card to collection', async(): Promise<void> => {
            const yuna =  await getRepository(Card).findOne({
                where: {name: 'Yuna'}
            });
            await server.get('/api/v1/cards/'+yuna!.code).set('authorization', authorizationHeader).then((res): void => {
                expect(res.error).to.be.false;
                expect(res).to.have.status(200);
                const card = res.body;
                expect(card.userCard[0].quantity).to.be.equal(1);
                expect(card.userCard[0].version).to.be.equal('full-art');
                expect(card.name).to.be.equal(yuna!.name);
            });

            await server.post(`/api/v1/cards/${yuna!.code}/add`).set('authorization', authorizationHeader).send({
                quantity: 1,
                version: 'full-art'
            }).then((res): void => {
                expect(res.error).to.be.false;
                expect(res).to.have.status(200);
            });

            await server.get('/api/v1/cards/'+yuna!.code).set('authorization', authorizationHeader).then((res): void => {
                expect(res.error).to.be.false;
                expect(res).to.have.status(200);
                const card = res.body;
                expect(card.userCard[0].quantity).to.be.equal(2);
                expect(card.userCard[0].version).to.be.equal('full-art');
                expect(card.name).to.be.equal(yuna!.name);
            });
        });

        it('should add a card to collection with negative quantity', async(): Promise<void> => {
            const sephiroth = await getRepository(Card).findOne({
                where : {name: 'Séphiroth'}
            });
            await server.post(`/api/v1/cards/${sephiroth!.code}/add`).set('authorization', authorizationHeader).send({
                quantity: -1,
                version: 'classic'
            }).then((res): void => {
                expect(res.body.message).to.be.equal('"quantity" must be greater than or equal to 0');
                expect(res).to.have.status(400);
            });
        });

        it('should add a card to collection with bad card code', async(): Promise<void> => {
            await server.post(`/api/v1/cards/badCode/add`).set('authorization', authorizationHeader).send({
                quantity: 1,
                version: 'classic'
            }).then((res): void => {
                expect(res.body.message).to.be.equal('card not found');
                expect(res).to.have.status(400);
            });
        });
    });

    describe('POST /cards/{code}/subtract', async (): Promise<void> => {
        it('should remove a card to collection when no card in collection', async(): Promise<void> => {
            const sephiroth = await getRepository(Card).findOne({
                where : {name: 'Séphiroth'}
            });
            await server.get('/api/v1/cards/'+sephiroth!.code).set('authorization', authorizationHeader).then((res): void => {
                expect(res.error).to.be.false;
                expect(res).to.have.status(200);
                const card = res.body;
                expect(card.userCard.length).to.be.equal(0);
                expect(card.name).to.be.equal(sephiroth!.name);
            });

            await server.post(`/api/v1/cards/${sephiroth!.code}/subtract`).set('authorization', authorizationHeader).send({
                quantity: 1,
                version: 'classic'
            }).then((res): void => {
                expect(res.body.message).to.be.equal("This user doesn't have this card");
                expect(res).to.have.status(400);
            });
        });

        it('should remove a card to collection', async(): Promise<void> => {
            const pampa =  await getRepository(Card).findOne({
                where: {name: 'Pampa'}
            });
            await server.get('/api/v1/cards/'+pampa!.code).set('authorization', authorizationHeader).then((res): void => {
                expect(res.error).to.be.false;
                expect(res).to.have.status(200);
                const card = res.body;
                expect(card.userCard[0].quantity).to.be.equal(10);
                expect(card.userCard[0].version).to.be.equal('classic');
                expect(card.name).to.be.equal(pampa!.name);
            });

            await server.post(`/api/v1/cards/${pampa!.code}/subtract`).set('authorization', authorizationHeader).send({
                quantity: 5,
                version: 'classic'
            }).then((res): void => {
                expect(res.error).to.be.false;
                expect(res).to.have.status(200);
            });

            await server.get('/api/v1/cards/'+pampa!.code).set('authorization', authorizationHeader).then((res): void => {
                expect(res.error).to.be.false;
                expect(res).to.have.status(200);
                const card = res.body;
                expect(card.userCard[0].quantity).to.be.equal(5);
                expect(card.userCard[0].version).to.be.equal('classic');
                expect(card.name).to.be.equal(pampa!.name);
            });
        });

        it('should remove last card to collection', async(): Promise<void> => {
            const yuna =  await getRepository(Card).findOne({
                where: {name: 'Yuna'}
            });
            await server.get('/api/v1/cards/'+yuna!.code).set('authorization', authorizationHeader).then((res): void => {
                expect(res.error).to.be.false;
                expect(res).to.have.status(200);
                const card = res.body;
                expect(card.userCard[0].quantity).to.be.equal(1);
                expect(card.userCard[0].version).to.be.equal('full-art');
                expect(card.name).to.be.equal(yuna!.name);
            });

            await server.post(`/api/v1/cards/${yuna!.code}/subtract`).set('authorization', authorizationHeader).send({
                quantity: 1,
                version: 'full-art'
            }).then((res): void => {
                expect(res.error).to.be.false;
                expect(res).to.have.status(200);
            });

            await server.get('/api/v1/cards/'+yuna!.code).set('authorization', authorizationHeader).then((res): void => {
                expect(res.error).to.be.false;
                expect(res).to.have.status(200);
                const card = res.body;
                expect(card.userCard.length).to.be.equal(0);
                expect(card.name).to.be.equal(yuna!.name);
            });
        });
    });
});
