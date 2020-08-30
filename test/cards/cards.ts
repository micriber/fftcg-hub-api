import chai from 'chai';
import app from '../../src/app';
import chaiHttp = require("chai-http");
import {getRepository} from "typeorm";
import * as JWT from "jsonwebtoken";
import Card from "../../src/cards/entities/card";
import loadFixtures from "../fixture";

chai.use(chaiHttp);
const {expect, request} = chai;
const authorizationHeader = 'bearer ' + JWT.sign({iss: 'https://accounts.google.com'}, 'test');

describe('Cards', async(): Promise<void> => {

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

    describe('GET /cards', async (): Promise<void> => {
        it('should return pagination of all card', async(): Promise<void> => {
            await server.get('/api/v1/cards').set('authorization', authorizationHeader).then((res): void => {
                expect(res.error).to.be.false;
                expect(res).to.have.status(200);

                const card = {
                    id: res.body.cards[0].id,
                    code: '1-176H',
                    element: '水',
                    rarity: 'H',
                    cost: '5',
                    power: '',
                    category1: 'X',
                    category2: '',
                    multicard: '',
                    exBurst: '○',
                    name: 'Yuna',
                    type: 'Soutien',
                    job: 'Invokeur',
                    text: "[[ex]]EX BURST [[/]]Lorsque Yuna entre sur le terrain, choisissez 1 Avant. Renvoyez-le dans la main de son propriétaire.[[br]] Si un Personnage est mis du terrain dans la Break Zone, vous pouvez le retirer du jeu à la place.",
                    userCard: [{
                        "quantity": 1,
                        "version": "full-art"
                    }]
                };
                expect(res.body.cards[0]).to.deep.equal(card);
                expect(res.body.total).to.be.equal(4);
            });
        });

        it('should return result filtered by "search" param', async () => {
            const search = 'sephiroth';
            await server.get(`/api/v1/cards?search=${search}`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);
                    const card = {
                        id: res.body.cards[0].id,
                        code: '1-186L',
                        element: '闇',
                        rarity: 'L',
                        cost: '8',
                        power: '8000',
                        category1: 'DFF &middot; VII',
                        category2: 'VII',
                        multicard: '',
                        exBurst: '',
                        name: 'Séphiroth',
                        type: 'Avant',
                        job: 'Héros',
                        text: "Initiative[[br]] Lorsque Séphiroth entre sur le terrain, choisissez 1 Soutien. Détruisez-le.",
                        userCard: []
                    };
                    expect(res.body.cards[0]).to.deep.equal(card);
                    expect(res.body.total).to.be.equal(1);
            });
        })
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
