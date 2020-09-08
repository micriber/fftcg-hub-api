import {EntityRepository, Repository} from "typeorm";
import Card from "../entities/card";
import User from "../../users/entities/user";
import {Brackets} from "typeorm/index";

export type paginationCards = {
    cards: Card[],
    page: number,
    perPage: number,
    total: number
}

export type filters = {
    search?: string
}

@EntityRepository(Card)
export class CardRepository extends Repository<Card> {

    public findByCode(code :string, user :User) :Promise<Card | undefined> {
        const cardsQuery = this.getBaseQueryBuilder(user);
        cardsQuery.andWhere('c.code = :code', {code});

        return cardsQuery.getOne();
    }

    public async getAllCardsWithPagination(user :User, filter :filters, page?: string, perPage?: string) :Promise<paginationCards> {
        const cardsQuery = this.getBaseQueryBuilder(user);

        if (filter.search !== undefined) {
            cardsQuery.andWhere(new Brackets(qb => {
                qb.where('unaccent(c.code) ILIKE unaccent(%:search%)', { search: filter.search })
                    .orWhere('unaccent(c.name) ILIKE unaccent(%:search%)', { search: filter.search })
            }))
        }

        const intPage = page ? +page : 1;
        const intPerPage = perPage ? +perPage : 1;

        // pagination
        cardsQuery.take(intPerPage);
        cardsQuery.skip((intPage-1)*intPerPage);
        cardsQuery.orderBy({
            'c.code': 'ASC',
        });

        const data = await cardsQuery.getManyAndCount();

        return {
            cards: data[0],
            page: intPage,
            perPage: intPerPage,
            total: data[1]
        };
    }

    private getBaseQueryBuilder(user: User) {
        const cardsQuery = this.createQueryBuilder('c');

        // Joins
        cardsQuery.leftJoinAndSelect('c.userCard', 'uc', 'c.id = "uc"."cardId"');
        cardsQuery.leftJoin('users', 'u', '"uc"."userId" = u.id');

        // where
        cardsQuery.andWhere(new Brackets(qb => {
            qb.where('uc.quantity IS NUll')
                .orWhere('u.id = :userId', {userId: user.id})
        }));
        return cardsQuery;
    }
}
