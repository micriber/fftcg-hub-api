import { EntityRepository, Repository } from 'typeorm';
import Card from '../entities/card';
import User from '../../users/entities/user';
import { Brackets } from 'typeorm/index';

export type PaginationCards = {
    cards: Card[];
    page: number;
    perPage: number;
    total: number;
};

export type Filters = {
    search?: string;
    owned?: boolean;
    // TODO
    types?: string[];
    elements?: string[];
    opus?: string[];
    rarities?: string[];
    categories?: string[];
    cost?: number[];
    power?: number[];
};

@EntityRepository(Card)
export class CardRepository extends Repository<Card> {
    public findByCode(code: string, user: User): Promise<Card | undefined> {
        const cardsQuery = this.getBaseQueryBuilder(user);
        cardsQuery.andWhere('c.code = :code', { code });

        return cardsQuery.getOne();
    }

    public async getAllCardsWithPagination(
        user: User,
        filter: Filters,
        page?: string,
        perPage?: string
    ): Promise<PaginationCards> {
        const cardsQuery = this.getBaseQueryBuilder(user);

        if (filter.search !== undefined) {
            cardsQuery.andWhere(
                new Brackets((qb) => {
                    qb.where('unaccent(c.code) ILIKE unaccent(:search)', {
                        search: `%${filter.search || ''}%`,
                    }).orWhere('unaccent(c.name) ILIKE unaccent(:search)', {
                        search: `%${filter.search || ''}%`,
                    });
                })
            );
        }

        if (filter.owned) {
            cardsQuery.andWhere(
                new Brackets((qb) => {
                    qb.where('uc.quantity IS NOT NUll').andWhere(
                        '"uc"."userId" = :userId',
                        {
                            userId: user.id,
                        }
                    );
                })
            );
        }

        if (filter.types) {
            cardsQuery.andWhere(
                new Brackets((qb) => {
                    qb.where('"c"."type" IN (:...types)', {
                        types: filter.types,
                    });
                })
            );
        }

        if (filter.elements) {
            cardsQuery.andWhere(
                new Brackets((qb) => {
                    qb.where('"ce"."element" IN (:...elements)', {
                        elements: filter.elements,
                    });
                })
            );
        }

        if (filter.opus) {
            cardsQuery.andWhere(
                new Brackets((qb) => {
                    qb.where('"c"."set" IN (:...opus)', {
                        opus: filter.opus,
                    });
                })
            );
        }

        if (filter.rarities) {
            cardsQuery.andWhere(
                new Brackets((qb) => {
                    qb.where('"c"."rarity" IN (:...rarities)', {
                        rarities: filter.rarities,
                    });
                })
            );
        }

        if (filter.categories) {
            cardsQuery.andWhere(
                new Brackets((qb) => {
                    qb.where('"c"."category1" IN (:...categories)', {
                        categories: filter.categories,
                    }).orWhere('"c"."category2" IN (:...categories)', {
                        categories: filter.categories,
                    });
                })
            );
        }

        if (
            filter.cost &&
            Array.isArray(filter.cost) &&
            filter.cost.length === 2
        ) {
            cardsQuery.andWhere(
                new Brackets((qb) => {
                    qb.where('"c"."cost"::INTEGER >= :minCost', {
                        minCost: filter.cost && filter.cost[0],
                    }).andWhere('"c"."cost"::INTEGER <= :maxCost', {
                        maxCost: filter.cost && filter.cost[1],
                    });
                })
            );
        }

        if (filter.power && filter.power.length === 2) {
            cardsQuery.andWhere(
                new Brackets((qb) => {
                    qb.where(
                        'nullif("c"."power", \'\')::INTEGER >= :minPower',
                        {
                            minPower: filter.power && filter.power[0],
                        }
                    ).andWhere(
                        'nullif("c"."power", \'\')::INTEGER <= :maxPower',
                        {
                            maxPower: filter.power && filter.power[1],
                        }
                    );
                })
            );
        }

        const intPage = page ? +page : 1;
        const intPerPage = perPage ? +perPage : 1;

        // pagination
        cardsQuery.take(intPerPage);
        cardsQuery.skip((intPage - 1) * intPerPage);
        cardsQuery.orderBy({
            'c.code': 'ASC',
        });

        const data = await cardsQuery.getManyAndCount();

        return {
            cards: data[0],
            page: intPage,
            perPage: intPerPage,
            total: data[1],
        };
    }

    private getBaseQueryBuilder(user: User) {
        const cardsQuery = this.createQueryBuilder('c');
        // Joins
        cardsQuery.leftJoinAndSelect(
            'c.userCard',
            'uc',
            `uc."userId" = '${user.id}'`
        );
        cardsQuery.leftJoin('users', 'u', '"uc"."userId" = u.id');
        cardsQuery.leftJoinAndSelect('c.elements', 'ce');

        return cardsQuery;
    }
}
