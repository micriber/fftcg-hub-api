import chai from 'chai';
import app from '../../src/app';
import chaiHttp = require('chai-http');
import { getRepository } from 'typeorm';
import * as JWT from 'jsonwebtoken';
import Card from '../../src/cards/entities/card';
import loadFixtures from '../fixture';
import { ErrorMessageType } from '../../src/utils/error';
import { PaginationCards } from '../../src/cards/repositories/card';

chai.use(chaiHttp);
const { expect, request } = chai;
const authorizationHeader =
    'bearer ' + JWT.sign({ iss: 'https://accounts.google.com' }, 'test');

describe('Cards', () => {
    let server: ChaiHttp.Agent;

    before(
        async (): Promise<void> => {
            const startedApp = await app;
            server = request(startedApp).keepOpen();
        }
    );

    beforeEach(
        async (): Promise<void> => {
            await loadFixtures();
        }
    );

    after(() => {
        server.close();
    });

    describe('GET /cards', () => {
        it('should return pagination of all card', async (): Promise<void> => {
            await server
                .get('/api/v1/cards')
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);

                    const body = res.body as PaginationCards;
                    const card = {
                        id: body.cards[0].id,
                        code: '1-176H',
                        elements: [{ element: 'water', id: 'b6041dbc-20a9-4a16-92a8-f6a0b0168002' }],
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
                        text:
                            '[[ex]]EX BURST [[/]]Lorsque Yuna entre sur le terrain, choisissez 1 Avant. Renvoyez-le dans la main de son propriétaire.[[br]] Si un Personnage est mis du terrain dans la Break Zone, vous pouvez le retirer du jeu à la place.',
                        set: 'Opus I',
                        userCard: [
                            {
                                quantity: 1,
                                version: 'full-art',
                            },
                        ],
                    };
                    expect(body.cards[0]).to.deep.equal(card);
                    expect(body.total).to.be.equal(5);
                });
        });

        it('should return result filtered by "search" param', async () => {
            const search = 'sephiroth';
            await server
                .get(`/api/v1/cards?search=${search}`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);

                    const body = res.body as PaginationCards;

                    const card = {
                        id: body.cards[0].id,
                        code: '1-186L',
                        elements: [{ element: 'dark', id: 'b6041dbc-20a9-4a16-92a8-f6a0b0168001' }],
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
                        text:
                            'Initiative[[br]] Lorsque Séphiroth entre sur le terrain, choisissez 1 Soutien. Détruisez-le.',
                        set: 'Opus I',
                        userCard: [],
                    };
                    expect(body.cards[0]).to.deep.equal(card);
                    expect(body.total).to.be.equal(1);
                });
        });

        it('should return result filtered by "owned" param', async () => {
            await server
                .get(`/api/v1/cards?perPage=50`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);

                    const body = res.body as PaginationCards;
                    const filterCards = body.cards.filter(
                        (card) => card.userCard.length === 0
                    );
                    expect(filterCards.length).to.be.greaterThan(0);
                });

            await server
                .get(`/api/v1/cards?perPage=50&owned=true`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);

                    const body = res.body as PaginationCards;
                    for (const card of body.cards) {
                        expect(card.userCard.length).to.be.greaterThan(0);
                    }
                });
        });
    });

    describe('GET /cards/{code}', () => {
        it('should return a card', async (): Promise<void> => {
            const databaseCard = (await getRepository(Card).findOne({
                relations: ['userCard', 'elements'],
            })) as Card;
            await server
                .get(`/api/v1/cards/${databaseCard.code}`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);
                    const card = res.body as Card;
                    expect(card.code).to.be.equal(databaseCard.code);
                    expect(card.rarity).to.be.equal(databaseCard.rarity);
                    expect(card.name).to.be.equal(databaseCard.name);
                    expect(card.text).to.be.equal(databaseCard.text);
                    expect(card.elements).to.be.deep.equal(
                        databaseCard.elements
                    );
                });
        });

        it('should return a multi-element card', async (): Promise<void> => {
            const databaseCard = (await getRepository(Card).findOne({
                relations: ['userCard', 'elements'],
                where: {
                    code: '12-120C',
                },
            })) as Card;
            await server
                .get(`/api/v1/cards/${databaseCard.code}`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);
                    const card = res.body as Card;
                    expect(card.code).to.be.equal(databaseCard.code);
                    expect(card.rarity).to.be.equal(databaseCard.rarity);
                    expect(card.name).to.be.equal(databaseCard.name);
                    expect(card.text).to.be.equal(databaseCard.text);
                    expect(card.elements).to.be.deep.equal(
                        databaseCard.elements
                    );
                });
        });

        it('card not exist', async (): Promise<void> => {
            await server
                .get('/api/v1/cards/codeDontExist')
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res).to.have.status(404);
                    expect((res.body as ErrorMessageType).message).to.be.equal(
                        'card not found'
                    );
                });
        });
    });
});
