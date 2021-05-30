import * as HTTPS from 'https';
import { createConnection, getConnectionOptions } from 'typeorm/index';
import { RandomGenerator } from 'typeorm/util/RandomGenerator';
import * as fs from 'fs';
import Card from '../entities/card';
import CardElement from '../entities/cardElement';

const dataFilePath = __dirname + '/cards.json';
const ELEMENTS = {
    火: {
        id: 1,
        name: 'fire',
    },
    氷: {
        id: 2,
        name: 'ice',
    },
    風: {
        id: 3,
        name: 'wind',
    },
    土: {
        id: 4,
        name: 'earth',
    },
    雷: {
        id: 5,
        name: 'lightning',
    },
    水: {
        id: 6,
        name: 'water',
    },
    光: {
        id: 7,
        name: 'light',
    },
    闇: {
        id: 8,
        name: 'dark',
    },
};

type JapaneseElement = keyof typeof ELEMENTS;

async function regenDataFile() {
    return new Promise((resolve, reject) => {
        console.info('regen data file');
        HTTPS.get('https://fftcg.square-enix-games.com/fr/get-cards', (res) => {
            const writer = fs.createWriteStream(dataFilePath);
            res.pipe(writer);
            writer.on('finish', () => {
                console.info('data file regeneration finish');
                resolve();
            });
        }).on('error', reject);
    });
}

async function loadData() {
    console.info('load data');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const cards = JSON.parse(fs.readFileSync(dataFilePath).toString()).cards;

    const database: string =
        (process.env.NODE_ENV === 'test'
            ? process.env.POSTGRES_DB_TEST
            : process.env.POSTGRES_DB) || 'fftcg-application';
    const connectionOptions = await getConnectionOptions();
    Object.assign(connectionOptions, { database: database });
    const connection = await createConnection(connectionOptions);

    const queryInsert = `INSERT INTO cards values (:id, :Code, :Rarity, :Cost, :Power, :Category_1, :Category_2, :Multicard, :Ex_Burst, :Name_FR, :Type_FR, :Job_FR, :Text_FR, :Set) ON CONFLICT DO NOTHING;`;
    const queryUpdate = `UPDATE cards SET rarity = :Rarity, cost = :Cost, power = :Power, category1 = :Category_1, category2 = :Category_2, multicard = :Multicard, "exBurst" = :Ex_Burst, name = :Name_FR, type = :Type_FR, job = :Job_FR, text = :Text_FR, set = :Set WHERE id = :id AND code = :Code;`;
    const queryRunner = connection.createQueryRunner();

    for (const card of cards) {
        const cardExist = await connection.getRepository(Card).findOne({
            where: {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                code: card.Code,
            },
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const sanitizedCard = {
            ...card,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
            Power: +card.Power === 0 || isNaN(+card.Power) ? '' : card.Power,
        };

        const query = !cardExist ? queryInsert : queryUpdate;
        if (!cardExist) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions
            console.log(`insert ${sanitizedCard.Code}`);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            sanitizedCard.id = RandomGenerator.uuid4();
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions
            console.log(`update ${sanitizedCard.Code}`);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            sanitizedCard.id = cardExist.id;
        }

        const [
            escapeQuery,
            parameters,
        ] = connection.driver.escapeQueryWithParameters(
            query,
            sanitizedCard,
            {}
        );
        await queryRunner.query(escapeQuery, parameters);

        const cardElementsExist = await connection
            .getRepository(CardElement)
            .findOne({
                where: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                    card: sanitizedCard.id,
                },
            });

        if (!cardElementsExist) {
            const insertElementQuery = `INSERT INTO "cardsElements" values (:cardId, :element) ON CONFLICT DO NOTHING;`;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
            const cardElements: JapaneseElement[] = sanitizedCard.Element.split(
                '/'
            ) as JapaneseElement[];
            for (const element of cardElements) {
                const cardElement = {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
                    cardId: sanitizedCard.id,
                    element: ELEMENTS[element].name,
                };
                const [
                    escapeElementQuery,
                    elementParameters,
                ] = connection.driver.escapeQueryWithParameters(
                    insertElementQuery,
                    cardElement,
                    {}
                );
                await queryRunner.query(escapeElementQuery, elementParameters);
            }
        }
    }
    console.log('insert/update cards finish');
}

async function start() {
    if (process.argv.includes('--regen-file')) {
        await regenDataFile();
    }
    await loadData();
    process.exit(0);
}

void start();
