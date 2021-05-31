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
                        elements: [
                            {
                                element: 'water',
                                id: 'b6041dbc-20a9-4a16-92a8-f6a0b0168002',
                            },
                        ],
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
                        elements: [
                            {
                                element: 'dark',
                                id: 'b6041dbc-20a9-4a16-92a8-f6a0b0168001',
                            },
                        ],
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
        it('should return result filtered by types', async () => {
            await server
                .get(`/api/v1/cards?perPage=50&types=Avant,Soutien`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);

                    const body = res.body as PaginationCards;
                    for (const card of body.cards) {
                        expect(card.type).to.be.oneOf(['Avant', 'Soutien']);
                    }
                });
        });
        it('should return result filtered by elements', async () => {
            await server
                .get(`/api/v1/cards?perPage=50&elements=earth`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);

                    const body = res.body as PaginationCards;
                    for (const card of body.cards) {
                        expect(card.elements).to.have.deep.members([
                            {
                                element: 'earth',
                                id: 'b6041dbc-20a9-4a16-92a8-f6a0b0168005',
                            },
                        ]);
                    }
                });

            await server
                .get(`/api/v1/cards?perPage=50&elements=dark,fire`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);

                    const body = res.body as PaginationCards;
                    for (const card of body.cards) {
                        expect(card.elements[0].element).to.be.oneOf([
                            'dark',
                            'fire',
                        ]);
                    }
                });
        });
        it('should return result filtered by opus', async () => {
            await server
                .get(`/api/v1/cards?perPage=50&opus=Opus_I,Opus_II`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);

                    const body = res.body as PaginationCards;
                    for (const card of body.cards) {
                        expect(card.set).to.be.oneOf(['Opus I', 'Opus II']);
                    }
                });
        });
        it('should return result filtered by rarities', async () => {
            await server
                .get(`/api/v1/cards?perPage=50&rarities=L,C`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);

                    const body = res.body as PaginationCards;
                    for (const card of body.cards) {
                        expect(card.rarity).to.be.oneOf(['L', 'C']);
                    }
                });
        });
        it('should return result filtered by categories', async () => {
            await server
                .get(`/api/v1/cards?perPage=50&categories=XI,VII`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);

                    const body = res.body as PaginationCards;
                    for (const card of body.cards) {
                        expect(card.category2).to.be.oneOf(['XI', 'VII']);
                    }
                });
        });
        it('should return result filtered by categories when category filter is partial category', async () => {
            await server
                .get(`/api/v1/cards?perPage=50&categories=DFF`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);

                    const body = res.body as PaginationCards;
                    const cardsWithExactCategory = body.cards.filter(
                        (value) => {
                            return value.category1 !== 'DFF';
                        }
                    );
                    expect(cardsWithExactCategory.length).to.be.greaterThan(0);
                });
        });
        it('should return result filtered by cost', async () => {
            await server
                .get(`/api/v1/cards?perPage=50&cost=4,8`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);

                    const body = res.body as PaginationCards;
                    for (const card of body.cards) {
                        expect(+card.cost >= 4 && +card.cost <= 8).to.be.true;
                    }
                });
        });
        it('should return result filtered by power', async () => {
            await server
                .get(`/api/v1/cards?perPage=50&power=7000,8000`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);

                    const body = res.body as PaginationCards;
                    for (const card of body.cards) {
                        expect(+card.power >= 7000 && +card.cost <= 8000).to.be
                            .true;
                    }
                });
        });
        it('should return result without power when min power filter is equal to 0', async () => {
            await server
                .get(`/api/v1/cards?perPage=50&power=0,15000`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);

                    const body = res.body as PaginationCards;
                    const cardsWithoutPower = body.cards.filter((value) => {
                        return value.power === '';
                    });
                    expect(cardsWithoutPower.length).to.be.greaterThan(0);
                });
        });
        it('should return result filtered by cost and power', async () => {
            await server
                .get(`/api/v1/cards?perPage=50&cost=0,10&power=0,15000`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);

                    const body = res.body as PaginationCards;
                    for (const card of body.cards) {
                        expect(+card.cost >= 0 && +card.cost <= 10).to.be.true;
                        expect(+card.power >= 0 && +card.cost <= 15000).to.be
                            .true;
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
