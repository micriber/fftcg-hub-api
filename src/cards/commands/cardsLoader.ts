import * as HTTPS from "https";
import {createConnection, getConnectionOptions} from "typeorm/index";
import {RandomGenerator} from "typeorm/util/RandomGenerator";
import * as fs from "fs";

const dataFilePath = __dirname + '/cards.json';

async function regenDataFile() {
    return new Promise((resolve, reject) => {
        console.info('regen data file');
        HTTPS.get('https://fftcg.square-enix-games.com/fr/get-cards', (res) => {
            const writer = fs.createWriteStream(dataFilePath)
            res.pipe(writer);
            writer.on('finish', () => {
                console.info('data file regeneration finish')
                resolve()
            });
        })
        .on('error', reject);
    });
}

async function loadData() {
    console.info('load data');
    const cards = JSON.parse(fs.readFileSync(dataFilePath).toString()).cards;

    const database :string = ((process.env.NODE_ENV === 'test') ? process.env.POSTGRES_DB_TEST : process.env.POSTGRES_DB) || 'fftcg-application' ;
    const connectionOptions = await getConnectionOptions();
    Object.assign(connectionOptions, { database:  database});
    const connection = await createConnection(connectionOptions);

    const query = `INSERT INTO cards values (:id, :Code, :Element, :Rarity, :Cost, :Power, :Category_1, :Category_2, :Multicard, :Ex_Burst, :Name_FR, :Type_FR, :Job_FR, :Text_FR) ON CONFLICT DO NOTHING;`;
    const queryRunner = connection.createQueryRunner();
    for (const card of cards) {
        card.id = RandomGenerator.uuid4();
        const [escapeQuery, parameters] = connection.driver.escapeQueryWithParameters(query, card, {});
        await queryRunner.query(escapeQuery, parameters);
    }
    console.log('insert cards finish')
}


async function start() {
    if (process.argv.includes('--regen-file')) {
        await regenDataFile();
    }
    await loadData();
    process.exit(0);
}

start();
