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
const authorizationHeader2 =
    'bearer ' + JWT.sign({ iss: 'https://accounts.google.com', email: 'email5@gmail.com' }, 'test');

describe('User cards', () => {
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

    describe('POST /cards/{code}/add', () => {
        it('should add a first card to collection', async (): Promise<void> => {
            const sephiroth = (await getRepository(Card).findOne({
                where: { name: 'Séphiroth' },
            })) as Card;
            await server
                .get(`/api/v1/cards/${sephiroth.code}`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);
                    const card = res.body as Card;
                    expect(card.userCard.length).to.be.equal(0);
                    expect(card.name).to.be.equal(sephiroth.name);
                });

            await server
                .post(`/api/v1/cards/${sephiroth.code}/add`)
                .set('authorization', authorizationHeader)
                .send({
                    quantity: 1,
                    version: 'classic',
                })
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);
                });

            await server
                .get(`/api/v1/cards/${sephiroth.code}`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);
                    const card = res.body as Card;
                    expect(card.userCard[0].quantity).to.be.equal(1);
                    expect(card.userCard[0].version).to.be.equal('classic');
                    expect(card.name).to.be.equal(sephiroth.name);
                });
        });

        it('should add a card to collection', async (): Promise<void> => {
            const yuna = (await getRepository(Card).findOne({
                where: { name: 'Yuna' },
            })) as Card;
            await server
                .get(`/api/v1/cards/${yuna.code}`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);
                    const card = res.body as Card;
                    expect(card.userCard[0].quantity).to.be.equal(1);
                    expect(card.userCard[0].version).to.be.equal('full-art');
                    expect(card.name).to.be.equal(yuna.name);
                });

            await server
                .post(`/api/v1/cards/${yuna.code}/add`)
                .set('authorization', authorizationHeader)
                .send({
                    quantity: 1,
                    version: 'full-art',
                })
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);
                });

            await server
                .get(`/api/v1/cards/${yuna.code}`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);
                    const card = res.body as Card;
                    expect(card.userCard[0].quantity).to.be.equal(2);
                    expect(card.userCard[0].version).to.be.equal('full-art');
                    expect(card.name).to.be.equal(yuna.name);
                });
        });

        it('should add a card to collection with negative quantity', async (): Promise<
            void
        > => {
            const sephiroth = (await getRepository(Card).findOne({
                where: { name: 'Séphiroth' },
            })) as Card;
            await server
                .post(`/api/v1/cards/${sephiroth.code}/add`)
                .set('authorization', authorizationHeader)
                .send({
                    quantity: -1,
                    version: 'classic',
                })
                .then((res): void => {
                    expect((res.body as ErrorMessageType).message).to.be.equal(
                        '"quantity" must be greater than or equal to 0'
                    );
                    expect(res).to.have.status(400);
                });
        });

        it('should add a card to collection with bad card code', async (): Promise<
            void
        > => {
            await server
                .post(`/api/v1/cards/badCode/add`)
                .set('authorization', authorizationHeader)
                .send({
                    quantity: 1,
                    version: 'classic',
                })
                .then((res): void => {
                    expect((res.body as ErrorMessageType).message).to.be.equal(
                        'card not found'
                    );
                    expect(res).to.have.status(400);
                });
        });
    });

    describe('GET /cards', () => {
        it('should get all cards after another user add to collection', async () => {
            const yuna = (await getRepository(Card).findOne({
                where: { name: 'Yuna' },
            })) as Card;
            await server
                .get(`/api/v1/cards/${yuna.code}`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);
                    const card = res.body as Card;
                    expect(card.userCard[0].quantity).to.be.equal(1);
                    expect(card.userCard[0].version).to.be.equal('full-art');
                    expect(card.name).to.be.equal(yuna.name);
                });

            await server
                .post(`/api/v1/cards/${yuna.code}/add`)
                .set('authorization', authorizationHeader)
                .send({
                    quantity: 1,
                    version: 'full-art',
                })
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);
                });

            await server
                .get(`/api/v1/cards/${yuna.code}`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);
                    const card = res.body as Card;
                    expect(card.userCard[0].quantity).to.be.equal(2);
                    expect(card.userCard[0].version).to.be.equal('full-art');
                    expect(card.name).to.be.equal(yuna.name);
                });
            
            await server
                .get('/api/v1/cards')
                .set('authorization', authorizationHeader2)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);
                    const body = res.body as PaginationCards;
                    const yunaCardFromBody = body.cards.filter((c) => c.name === yuna.name)
                    expect(yunaCardFromBody).not.be.empty;
                    expect(yunaCardFromBody[0].userCard).empty;
                })
        });
    });

    describe('POST /cards/{code}/subtract', () => {
        it('should remove a card to collection when no card in collection', async (): Promise<
            void
        > => {
            const sephiroth = (await getRepository(Card).findOne({
                where: { name: 'Séphiroth' },
            })) as Card;
            await server
                .get(`/api/v1/cards/${sephiroth.code}`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);
                    const card = res.body as Card;
                    expect(card.userCard.length).to.be.equal(0);
                    expect(card.name).to.be.equal(sephiroth.name);
                });

            await server
                .post(`/api/v1/cards/${sephiroth.code}/subtract`)
                .set('authorization', authorizationHeader)
                .send({
                    quantity: 1,
                    version: 'classic',
                })
                .then((res): void => {
                    expect((res.body as ErrorMessageType).message).to.be.equal(
                        "This user doesn't have this card"
                    );
                    expect(res).to.have.status(400);
                });
        });

        it('should remove a card to collection', async (): Promise<void> => {
            const pampa = (await getRepository(Card).findOne({
                where: { name: 'Pampa' },
            })) as Card;
            await server
                .get(`/api/v1/cards/${pampa.code}`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);
                    const card = res.body as Card;
                    expect(card.userCard[0].quantity).to.be.equal(10);
                    expect(card.userCard[0].version).to.be.equal('classic');
                    expect(card.name).to.be.equal(pampa.name);
                });

            await server
                .post(`/api/v1/cards/${pampa.code}/subtract`)
                .set('authorization', authorizationHeader)
                .send({
                    quantity: 5,
                    version: 'classic',
                })
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);
                });

            await server
                .get(`/api/v1/cards/${pampa.code}`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);
                    const card = res.body as Card;
                    expect(card.userCard[0].quantity).to.be.equal(5);
                    expect(card.userCard[0].version).to.be.equal('classic');
                    expect(card.name).to.be.equal(pampa.name);
                });
        });

        it('should remove last card to collection', async (): Promise<void> => {
            const yuna = (await getRepository(Card).findOne({
                where: { name: 'Yuna' },
            })) as Card;
            await server
                .get(`/api/v1/cards/${yuna.code}`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);
                    const card = res.body as Card;
                    expect(card.userCard[0].quantity).to.be.equal(1);
                    expect(card.userCard[0].version).to.be.equal('full-art');
                    expect(card.name).to.be.equal(yuna.name);
                });

            await server
                .post(`/api/v1/cards/${yuna.code}/subtract`)
                .set('authorization', authorizationHeader)
                .send({
                    quantity: 1,
                    version: 'full-art',
                })
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);
                });

            await server
                .get(`/api/v1/cards/${yuna.code}`)
                .set('authorization', authorizationHeader)
                .then((res): void => {
                    expect(res.error).to.be.false;
                    expect(res).to.have.status(200);
                    const card = res.body as Card;
                    expect(card.userCard.length).to.be.equal(0);
                    expect(card.name).to.be.equal(yuna.name);
                });
        });
    });
});
