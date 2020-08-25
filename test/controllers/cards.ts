import chai from 'chai';
import app from '../../src/app';
import chaiHttp = require("chai-http");
import {Brackets, getRepository} from "typeorm";
import JWT from "jsonwebtoken";
import Card from "../../src/entities/card";
import CardEntity from "../../src/entities/card";

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

        it('should return result filtered by "search" param', async () => {
            const search = 'sephiroth';
            const cardRepository = getRepository(CardEntity);
            const cardsQuery = cardRepository.createQueryBuilder('cards')
                .andWhere(new Brackets(qb => {
                    qb.where('unaccent(cards.code) ILIKE unaccent(:search)', { search: `%${search}%` })
                        .orWhere('unaccent(cards.name) ILIKE unaccent(:search)', { search: `%${search}%` })
                }))
            // console.log(cardsQuery.getSql())
            const databaseCard = await cardsQuery.paginate();
            await server.get(`/api/v1/cards?search=${search}`)
              .set('authorization', authorizationHeader)
              .then((res): void => {
                expect(res.error).to.be.false;
                expect(res).to.have.status(200);
                console.log({body: res.body, data: databaseCard!.data})
                expect(res.body.total).to.be.equal(databaseCard!.data.length);
                expect(res.body.data).to.deep.equal(databaseCard!.data);
                const card = res.body.data[0];
                console.log(databaseCard!.data);
                expect(card.code).to.be.equal(databaseCard!.data[0].code);
                expect(card.rarity).to.be.equal(databaseCard!.data[0].rarity);
                expect(card.name).to.be.equal(databaseCard!.data[0].name);
                expect(card.text).to.be.equal(databaseCard!.data[0].text);

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
