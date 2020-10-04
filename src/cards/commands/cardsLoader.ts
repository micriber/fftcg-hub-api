import * as HTTPS from 'https';
import { createConnection, getConnectionOptions } from 'typeorm/index';
import { RandomGenerator } from 'typeorm/util/RandomGenerator';
import * as fs from 'fs';
import Card from '../entities/card';

const dataFilePath = __dirname + '/cards.json';

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

    const queryInsert = `INSERT INTO cards values (:id, :Code, :Element, :Rarity, :Cost, :Power, :Category_1, :Category_2, :Multicard, :Ex_Burst, :Name_FR, :Type_FR, :Job_FR, :Text_FR, :Set) ON CONFLICT DO NOTHING;`;
    const queryUpdate = `UPDATE cards SET element = :Element, rarity = :Rarity, cost = :Cost, power = :Power, category1 = :Category_1, category2 = :Category_2, multicard = :Multicard, "exBurst" = :Ex_Burst, name = :Name_FR, type = :Type_FR, job = :Job_FR, text = :Text_FR, set = :Set WHERE id = :id AND code = :Code;`;
    const queryRunner = connection.createQueryRunner();

    for (const card of cards) {
        const cardExist = await connection.getRepository(Card).findOne({
            where: {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                code: card.Code,
            },
        });

        const query = !cardExist ? queryInsert : queryUpdate;
        if (!cardExist) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions
            console.log(`insert ${card.Code}`);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            card.id = RandomGenerator.uuid4();
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions
            console.log(`update ${card.Code}`);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            card.id = cardExist.id;
        }

        const [
            escapeQuery,
            parameters,
        ] = connection.driver.escapeQueryWithParameters(query, card, {});
        await queryRunner.query(escapeQuery, parameters);
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
